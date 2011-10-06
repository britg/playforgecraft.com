@TileView = Backbone.View.extend
  
  tagName: "div"

  className: "tile"

  events:

    mousedown: "beginWatchingMovement"
    mousemove: "watchMovement"
    mouseup: "stopWatchingMovement"
    mouseout: "stopWatchingMovement"

  initialize: () ->
    @model.bind "change:forgeable", @updateHighlight, @

  render: () ->
    # console.log("Model changed!", @model)

  updateHighlight: () ->
    if forgeable = @model.get("forgeable")?
      $(@el).addClass "forgeable"
    else
      $(@el).removeClass "forgeable"

  beginWatchingMovement: (e)->
    console.log "Watching", @.id
    @watching = true
    @ref = x: e.pageX, y: e.pageY

    e.preventDefault()
    false

  watchMovement: (e) ->
    return unless @watching
    
    @delta = x: e.pageX - @ref.x, y: e.pageY - @ref.y

    console.log "Moving", @id, @delta.x, @delta.y

    e.preventDefault()
    false

  stopWatchingMovement: ->
    return unless @watching

    console.log "Stopping watcher", @id, @model.get("x"), @model.get("y")
    @watching = false