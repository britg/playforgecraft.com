class ForgeCraft.Views.ForgeView extends Backbone.View

  tagName: 'div'
  id: 'forge'

  events:

    mousedown:  "beginWatchingMovement"
    touchstart: "beginWatchingMovement"
    mousemove:  "watchMovement"
    touchmove:  "watchMovement"
    mouseup:    "attemptForge"
    touchend:   "attemptForge"
    mouseout:   "stopWatchingMovement"
    touchcancel:"stopWatchingMovement"

  initialize: ->
    
    @model.bind "change:funds", @updateFunds, @
    @model.bind "change:progress_percent", @updateProgressPercent, @
    @model.bind "change:complete", @complete, @
    @model.bind "ForgeCraft:NeedMoreCoins", @shakeFunds, @

    window.Ores = new ForgeCraft.Collections.OresCollection
    Ores.bind "add", @displayOre, @
    Ores.bind "reveal", @displayAllOres, @
    Ores.bind "reset", @clearOres, @

    @initializeActiveForge()
    @renderForge()
    @renderEvents()

    unless Modernizr.touch
      $(window).unbind('resize').resize =>
        @renderForge()

    $(document).unbind('orientationchange').bind 'orientationchange', =>
      @renderForge()

  initializeActiveForge: ->
    window.activeForgeView = new ForgeCraft.Views.ActiveForgeView el: $('#active-forge').get(0)
    activeForgeView.bind "ForgeCraft:activeForgeComplete", @forgeWithAccuracy, @

  renderForge: ->
    return if @renderHold

    @clearOres()
    loadingView.show()

    @correctSidebarHeight()

    clearTimeout @redrawTimeout

    @redrawTimeout = setTimeout =>
      @calculateDimensions()
      @initializeOres()
      loadingView.hide()
    , 500

  correctSidebarHeight: ->
    @topBarHeight   = $('.topbar').height();
    @htmlHeight     = $('html').height();
    $('#sidebar').css minHeight: @htmlHeight - @topBarHeight

  # Events

  renderEvents: ->
    window.eventsView = new ForgeCraft.Views.EventsView

  # Ores


  clearOres: ->
    $('#ores').html('')

  calculateDimensions: ->

    @topBarHeight   = $('.topbar').height();
    @htmlHeight     = $('html').height();
    @forgeHeight    = (@htmlHeight - @topBarHeight)
    $('#forge').css height: @forgeHeight

    @forgeWidth     = $('#forge').width()
    @sidebarWidth   = $('#sidebar').width()

    $('#ores').css width: (@forgeWidth - @sidebarWidth - 20), height: @forgeHeight
    $('#effects-canvas').css width: (@forgeWidth - @sidebarWidth - 20), height: @forgeHeight
    
    @topOffset      = parseInt($('#ores').css('paddingTop'))

    @oresHeight     = $('#forge').height() - @topOffset + 10
    @oresWidth      = $('#ores').width()

    @hMargin        = (@oresWidth % ForgeCraft.Config.oreDim)/2

    @cols           = Math.floor(@oresWidth/ForgeCraft.Config.oreDim)
    @rows           = Math.floor(@oresHeight/ForgeCraft.Config.oreDim)
    @numOres        = @cols * @rows

    Ores.numCols    = @cols
    Ores.numRows    = @rows

    # console.log "Ores width:", @oresWidth, "height:", @oresHeight, "cols:", @cols, "rows:", @rows

  initializeOres: ->

    # Ask the server for ores
    console.log "Initializing Ores for", @numOres, "ores"
    Ores.initialFill(@numOres)

  displayOre: (ore) ->
    # console.log "Creating view for ore", ore.forLog()
    view = new ForgeCraft.Views.OreView model: ore
    view.renderAndPosition()

  displayAllOres: ->
    # console.log "Creating view for all ores"
    @clearOres()
    Ores.forEach (ore) =>
      @displayOre(ore)

  beginWatchingMovement: (e)->
    return if @oreLock
    # console.log "Watching", e
    @watching = true
    @ref = x: e.pageX, y: e.pageY

    unless $(e.target).hasClass("ore") and touchedView = $(e.target).data('view')
      @watching = false
      return

    x = touchedView.model.get('x')
    y = touchedView.model.get('y')
    @refOre = Ores.oreAt x, y

    console.log "Clicked ore is ", @refOre.forLog()

    e.preventDefault()
    false

  watchMovement: (e) ->
    return if @oreLock
    return unless @watching
    
    @delta = x: e.pageX - @ref.x, y: e.pageY - @ref.y

    # console.log('delta is', @delta.x, @delta.y)

    # right
    if @delta.x >= ForgeCraft.Config.moveThreshold and @refOre.get("x") < Ores.numCols - 1
      @swapOre = Ores.oreAt @refOre.get('x') + 1, @refOre.get('y')

    # left
    if @delta.x <= -ForgeCraft.Config.moveThreshold and @refOre.get("x") > 0
      @swapOre = Ores.oreAt @refOre.get('x') - 1, @refOre.get('y')
    
    # down
    if @delta.y >= ForgeCraft.Config.moveThreshold and @refOre.get("y") < Ores.numRows - 1
      @swapOre = Ores.oreAt @refOre.get('x'), @refOre.get('y') + 1

    # up
    if @delta.y <= -ForgeCraft.Config.moveThreshold and @refOre.get("y") > 0
      @swapOre = Ores.oreAt @refOre.get('x'), @refOre.get('y') - 1
      
    if @swapOre?
      Ores.swapOresAndValidate @refOre, @swapOre
      @stopWatchingMovement()

    e.preventDefault()
    false

  attemptForge: ->
    return if @oreLock
    unless forge.hasEnoughFunds(2)
      forge.trigger "ForgeCraft:NeedMoreCoins"
      return
      
    if @refOre and not @swapOre
      if @forgeable = @refOre.get("forgeable")
        $('.ore').addClass("unmarked")
        if activeForgeView.shouldTrigger()
          activeForgeView.start()
        else
          @forgeable.forge()

    @stopWatchingMovement()

  forgeWithAccuracy: (accuracy) ->
    @forgeable.forge(accuracy) if @forgeable?

  stopWatchingMovement: ->
    return unless @watching

    # console.log "Stopping watcher"
    @ref = undefined
    @refOre = undefined
    @swapOre = undefined
    @watching = false

  updateFunds: ->
    return unless @model.get("requires_funding")
    console.log "Updating funds to", @model.get("funds")
    $('.funds').find('.amount').html(number_with_delimiter(@model.get("funds")))

  updateProgressPercent: ->
    console.log "Updating progress percent to", @model.get("progress_percent")
    $('.percent').find('.amount').html(@model.get("progress_percent"))
    $('.progress').find('.bar').css width: @model.get("progress_percent") + "%"

    progresses = @model.get("progresses")

    _.each progresses, (progress) ->
      id = progress["_id"]
      q = progress["quantity"]
      complete = progress["complete"]
      $('#quantity_progress_' + id).html(q)

      if complete
        $('#progress_' + id).addClass("complete")
      else
        $('#progress_' + id).removeClass("complete")

  startBattle: (ident) ->
    Backbone.history.navigate "battles/" + ident, true

  complete: ->
    $('#ores').fadeOut ->
      $('#ores')
        .html("(Placeholder) Congrats, you completed this forge.")
        .fadeIn()