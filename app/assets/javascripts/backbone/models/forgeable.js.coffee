class ForgeCraft.Models.Forgeable extends Backbone.Model
  
  defaults:
    classification: ""
    ore: ""
    ores: []

  initialize: ->
    @bind "change:ores", @updateTileForgeables
    @trigger "change:ores", @, @get("ores")

  updateTileForgeables: (model, ores) ->
    # console.log("Updating ore forgeables", model, ores)
    self = @

    prevTiles = @previous("ores")
    $.each prevTiles, (i, ore) ->
      ore.set forgeable: undefined unless _.include ores, ore

    $.each ores, (i, ore) ->
      ore.set forgeable: self

class ForgeCraft.Collections.Forgeables extends Backbone.Collection
  
  model: ForgeCraft.Models.Forgeable