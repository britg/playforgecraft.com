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
    window.Ores = new ForgeCraft.Collections.OresCollection
    @renderForge()

    $(window).resize ->
      forgeView.renderForge()

  renderForge: ->
    $('#ores').html('')
    clearTimeout @redrawTimeout
    @redrawTimeout = setTimeout =>
      forgeView.calculateDimensions()
      forgeView.fetchInitialOres()
    , 500

  calculateDimensions: ->
    @topOffset = parseInt($('#ores').css('paddingTop'))
    @oresHeight = $('#forge').height() - @topOffset + 10
    @oresWidth = $('#ores').width()
    @cols = Math.floor(@oresWidth/ForgeCraft.Config.oreDim)
    Ores.numCols = @cols
    @hMargin = (@oresWidth % ForgeCraft.Config.oreDim)/2
    @rows = Math.floor(@oresHeight/ForgeCraft.Config.oreDim)
    Ores.numRows = @rows
    @numOres = @cols * @rows

    @lootListHeight = $('#sidebar').height() - $('#loot-list').position().top - 10
    $('#loot-list').css('height', @lootListHeight);

    console.log "Ores width:", @oresWidth, "height:", @oresHeight, "cols:", @cols, "rows:", @rows

  fetchInitialOres: ->

    # Ask the server for ores
    console.log "Asking for", @numOres, "ores"
    Ores.fetch data: {count: @numOres}, success: @fillInitialOres

  fillInitialOres: (collection) ->
    console.log "Filling ores", collection

    col = 0
    row = 0
    Ores.forEach (ore) ->
      ore.set x: col, y: row
      Ores.cache(ore)

      view = new ForgeCraft.Views.OreView model: ore
      view.render()
      $('#ores').append(view.el)

      $(view.el).css("left", ForgeCraft.Config.oreDim * col + forgeView.hMargin)
      $(view.el).css("top", ForgeCraft.Config.oreDim * row + forgeView.topOffset)
      ore_url = ForgeCraft.Config.ores[ore.get("rank")]
      $(view.el).css("backgroundImage", "url(" + ore_url + ")")

      col++
      if col >= forgeView.cols
        col = 0
        row++

    Ores.refresh()

  beginWatchingMovement: (e)->
    return if @oreLock
    # console.log "Watching", e
    @watching = true
    @ref = x: e.pageX, y: e.pageY

    return unless touchedView = $(e.target).data('view')

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
      Ores.swapOres @refOre, @swapOre
      @stopWatchingMovement()

    e.preventDefault()
    false

  attemptForge: ->
    return if @oreLock
    if @refOre and not @swapOre
      if forgeable = @refOre.get("forgeable")
        forgeable.forge()

    @stopWatchingMovement()

  stopWatchingMovement: ->
    return unless @watching

    # console.log "Stopping watcher"
    @ref = undefined
    @refOre = undefined
    @swapOre = undefined
    @watching = false