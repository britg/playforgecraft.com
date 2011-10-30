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

  toJSON: ->
    forging:
      classification: @get("classification")
      ore: @get("ore")
      accuracy: 100

  forge: ->
    $.each @get("ores"), (i, ore) ->
      ore.clearForgeable()
      ore.destroy()

    @save @toJSON, success: @convertToLoot
  
  convertToLoot: (forgeable, params) ->
    console.log "Loot from server is:", params
    loot = new ForgeCraft.Models.Loot(params)
    lootView = new ForgeCraft.Views.LootView id: loot.id, model: loot, el: $('#loot-template').find('.loot').clone().get(0)
    lootView.render()
    lootView.display()
    Forgings.remove(forgeable)

class ForgeCraft.Collections.Forgings extends Backbone.Collection
  
  model: ForgeCraft.Models.Forgeable
  url: '/forge.json'

  forge: (forgeable) ->
    console.log "Forging", forgeable
    forgeable.forge()