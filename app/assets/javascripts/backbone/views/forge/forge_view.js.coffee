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
    @renderLoot()

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

  renderLoot: ->
    Loot.unbind "add"
    Loot.unbind "reset"

    Loot.bind "add", @displayLoot, @
    Loot.bind "reset", @displayAllLoot, @
    Loot.reset(ForgeCraft.Config.loot)

    $('.more-loot').click ->
      Loot.fetchMore(10)
      return false

    $(window).scroll ->
      if isScrolledIntoView($('#loot-list-more'))
        forgeView.fetchMoreLoot()
  
  fetchMoreLoot: ->
    return if Loot.fetchLootLock is on
    clearTimeout(@fetchMoreLootTimeout)
    @fetchMoreLootTimeout = setTimeout ->
      Loot.fetchMore(10)
    , 500

  displayAllLoot: ->
    Loot.forEach (loot) =>
      @displayLoot(loot)

  displayLoot: (loot) ->
    if $('#loot-list').length > 0
      lootView = new ForgeCraft.Views.LootView id: loot.id, model: loot, el: $('#loot-template').find('.loot').clone().get(0)
      lootView.render()
      lootView.addToLootList()

  reflectBottomOfLootList: ->
    $('#loot-list-more').remove()
    $(window).unbind('scroll')

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
        rand = Math.floor(Math.random()*5)
        console.log("Active Forge roll is " + rand)
        if rand == 2
          activeForgeView.start()
        else
          @forgeable.forge()

    @stopWatchingMovement()

  forgeWithAccuracy: (accuracy) ->
    @forgeable.forge() if @forgeable?

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

  shakeFunds: ->
    $('.funds').effect("shake", { times: 3, distance: 10 }, 50)

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