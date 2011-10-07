@TileView = Backbone.View.extend
  
  tagName: "div"

  className: "tile"

  initialize: () ->
    @model.bind "change:forgeable", @updateHighlight, @
    @model.bind "change:x", @updateCoordinates, @
    @model.bind "change:y", @updateCoordinates, @
    $(@el).css left: @leftPos()
    @animateToPosition(yes)

  render: () ->
    # console.log("Model changed!", @model)

  leftPos: () ->
    boardLeft = $('#tiles').position().left
    boardLeft + config.tileWidth * @model.get("x")

  topPos: () ->
    boardTop = $('#tiles').position().top
    topPos = boardTop + config.tileWidth * @model.get("y")

  updateCoordinates: () ->
    $(@el).attr("data-x", @model.get('x')).attr("data-y", @model.get('y'))
    $(@el).find('img').attr("data-x", @model.get('x')).attr("data-y", @model.get('y'))

    @animateToPosition(no)

  animateToPosition: (dropDelay = no) ->
    self = @
    timeout = parseInt(Math.random() * config.dropInTimeout)

    $(@el).animate left: @leftPos(), "fast"

    dropDown = ->
      $(self.el).animate top: self.topPos(), "fast"
    
    if dropDelay
      console.log("timeout on move")
      setTimeout dropDown, timeout
    else
      dropDown()

  updateHighlight: () ->
    if forgeable = @model.get("forgeable")?
      $(@el).addClass "forgeable"
    else
      $(@el).removeClass "forgeable"
