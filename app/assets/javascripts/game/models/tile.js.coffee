@Tile = Backbone.Model.extend

  defaults:
    x: 0
    y: 0
    ore: ""

  clearForgeable: ->
    @set forgeable: undefined
