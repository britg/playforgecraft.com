@BoardView = Backbone.View.extend
  
  tagName: "div"

  className: "board"

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
    @tileLock = off

  reveal: ->
    $('.tile').fadeIn()
    @watchWindowResize()

  watchWindowResize: ->
    $(window).resize =>
      $('.tile').each (i, tile) ->
        view = $(tile).data("view")
        view.jumpToPosition()

  addTile: (tile) ->
    console.log "Creating a new tile view from tile", tile
    tileView = new TileView 
      model: tile
      id: tile.get("id")
    tileView.render()
    $(@el).append(tileView.el)
    tileView.updateCoordinates()

  beginWatchingMovement: (e)->
    return if @tileLock
    # console.log "Watching", e
    @watching = true
    @ref = x: e.pageX, y: e.pageY
    @refTile = @model.tileAt $(e.target).attr("data-x"), $(e.target).attr("data-y")

    # console.log "Clicked tile is ", @refTile.forLog()

    e.preventDefault()
    false

  watchMovement: (e) ->
    return if @tileLock
    return unless @watching
    
    @delta = x: e.pageX - @ref.x, y: e.pageY - @ref.y

    # console.log('delta is', @delta.x, @delta.y)

    # right
    if @delta.x >= config.moveThreshold and @refTile.get("x") < config.numCols - 1
      @swapTile = @model.tileAt @refTile.get('x') + 1, @refTile.get('y')

    # left
    if @delta.x <= -config.moveThreshold and @refTile.get("x") > 0
      @swapTile = @model.tileAt @refTile.get('x') - 1, @refTile.get('y')
    
    # down
    if @delta.y >= config.moveThreshold and @refTile.get("y") < config.numRows - 1
      @swapTile = @model.tileAt @refTile.get('x'), @refTile.get('y') + 1

    # up
    if @delta.y <= -config.moveThreshold and @refTile.get("y") > 0
      @swapTile = @model.tileAt @refTile.get('x'), @refTile.get('y') - 1
      
    if @swapTile?
      @model.swapTiles @refTile, @swapTile
      @stopWatchingMovement()

    e.preventDefault()
    false

  attemptForge: ->
    return if @tileLock
    if @refTile and not @swapTile
      if forgeable = @refTile.get("forgeable")
        game.forge(forgeable)

    @stopWatchingMovement()

  stopWatchingMovement: ->
    return unless @watching

    # console.log "Stopping watcher"
    @ref = undefined
    @refTile = undefined
    @swapTile = undefined
    @watching = false