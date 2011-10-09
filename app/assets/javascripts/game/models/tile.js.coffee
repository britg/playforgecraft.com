@Tile = Backbone.Model.extend

  defaults:
    x: 0
    y: 0
    ore: ""
    consumed: false
    neighbors: []

  initialize: ->
    @bind "change:x", @triggerPositionChange, @
    @bind "change:y", @triggerPositionChange, @

  triggerPositionChange: ->
    # console.log "Trigger change", @changedAttributes()
    @recache()

  recache: ->
    # console.log "Updating board due to position change"
    game.board.recacheTile(@)

  clearForgeable: ->
    @set forgeable: undefined
    @set neighbors: []

  consume: ->
    x = @get("x")
    y = @get("y")
    @set consumed: true
    game.board.removeTile @

  isNeighbor: (dir) ->
    # console.log "is neighbor", dir
    newNeighbors = []
    
    # right
    if dir[0] == 1 and dir[1] == 0
      newNeighbors.push "left"
    if dir[0] == -1 and dir[1] == 0
      newNeighbors.push "right"
    if dir[0] == 0 and dir[1] == 1
      newNeighbors.push "top"
    if dir[0] == 0 and dir[1] == -1
      newNeighbors.push "bottom"

    @set neighbors: _.union(@get("neighbors"), newNeighbors)

  hasNeighbor: (dir) ->
    newNeighbors = []

    # right
    if dir[0] == 1 and dir[1] == 0
      newNeighbors.push "right"
    if dir[0] == -1 and dir[1] == 0
      newNeighbors.push "left"
    if dir[0] == 0 and dir[1] == 1
      newNeighbors.push "bottom"
    if dir[0] == 0 and dir[1] == -1
      newNeighbors.push "top"

    @set neighbors: _.union(@get("neighbors"), newNeighbors)

  forLog: ->
    @get("ore") + " (" + @get("x") + ", " + @get("y") + ")" + " in forgeable " + @get("forgeable")