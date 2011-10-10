@TileView = Backbone.View.extend
  
  tagName: "div"

  className: "tile"

  # events:
  #   click: "click"

  initialize: () ->
    @model.bind "change:forgeable", @updateHighlight, @
    @model.bind "change:x", @updateCoordinates, @
    @model.bind "change:y", @updateCoordinates, @
    @model.bind "change:neighbors", @updateNeighbors, @
    @model.bind "change:consumed", @consume, @
    $(@el).css left: @leftPos(), top: @topPos()
    

  render: () ->
    newTile = $('.tile').first().clone()
    newImg = $('.tile').first().find('img').clone()
    clonedOre = newTile.attr("data-ore")
    ore = @model.get("ore")

    newImg.attr("src", config[ore + "_tile"])
          .removeClass(clonedOre).addClass(ore)
          .attr("data-x", @model.get("x"))
          .attr("data-y", @model.get("y"))
          .attr("data-ore", @model.get("ore"))

    newTile.attr("id", "tile_" + @id)
           .removeClass(clonedOre).addClass(ore)
           .attr("data-x", @model.get("x"))
           .attr("data-y", @model.get("y"))
           .attr("data-ore", @model.get("ore"))
           .html(newImg)

    newTile.css top: -100, left: 0

    @el = newTile.get(0)

    # console.log "rendering", @
    @

  click: () ->
    # console.log("Neighbors", @model.get("neighbors"))
    forgeable = @model.get("forgeable")
    console.log("forgeable is ", forgeable)
    game.forge(forgeable) if forgeable?

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
      # console.log("timeout on move")
      setTimeout dropDown, timeout
    else
      dropDown()

  updateHighlight: () ->
    if forgeable = @model.get("forgeable")?
      $(@el).addClass "forgeable"
    else
      $(@el).removeClass "forgeable"

  updateNeighbors: () ->
    n = @model.get("neighbors")
    d = ["top", "right", "bottom", "left"]

    $(@el).removeClass(d.join(" "))
    $(@el).addClass(n.join(" "))

  consume: () ->
    $(@el).fadeOut "slow", -> $(@).remove()