@Tile = Backbone.Model.extend

  defaults:
    x: 0
    y: 0
    ore: ""
    consumed: false
    neighbors: []

  clearForgeable: ->
    @set forgeable: undefined
    @set neighbors: []

  consume: ->
    x = @get("x")
    y = @get("y")
    @set consumed: true

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