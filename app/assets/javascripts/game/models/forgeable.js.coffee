@Forgeable = Backbone.Model.extend
  
  defaults:
    classification: ""
    ore: ""
    tiles: []

  initialize: ->
    @bind "change:tiles", @updateTileForgeables
    @trigger "change:tiles", @, @get("tiles")

  updateTileForgeables: (model, tiles) ->
    # console.log("Updating tile forgeables", model, tiles)
    self = @

    prevTiles = @previous("tiles")
    $.each prevTiles, (i, tile) ->
      tile.set forgeable: undefined unless _.include tiles, tile

    $.each tiles, (i, tile) ->
      tile.set forgeable: self

  toJSON: ->
    forgeable =
      classification: @get("classification")
      ore: @get("ore")