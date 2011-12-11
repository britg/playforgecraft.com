class ForgeCraft.Models.Forge extends Backbone.Model

  hasEnoughFunds: (amount) ->
    return yes unless @get("requires_funding")
    @get("funds") > amount
  

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
      ore_count: @get("ores").length
      accuracy: 100

  forge: ->
    return if @forging
    @forging = true
    Ores.clearForgeables()
    @markOres()
    @save @toJSON, success: @convertToLootIfPurchased

  markOres: ->
    $.each @get("ores"), (i, ore) ->
      ore.set marked: true

  unmarkOres: ->
    $.each @get("ores"), (i, ore) ->
      ore.set marked: false    
  
  convertToLootIfPurchased: (forgeable, params) ->
    console.log "Response from server is:", params

    if params.purchased
      forgeable.convertToLoot(params)
    else
      forgeable.unableToPurchase(params)
    
  convertToLoot: (params) ->
    loot = new ForgeCraft.Models.Loot(params.loot)
    player.set(params.player)
    Loot.add(loot)
    Ores.addReplacements(params.replacements)
    @consumeOres()
    Forgings.remove(@)

  unableToPurchase: (params) ->
    @unmarkOres()
    forge.trigger "ForgeCraft:NeedMoreCoins"
    player.set(params.player)
    Ores.refresh()

  consumeOres: ->
    $.each @get("ores"), (i, ore) ->
      ore.clearForgeable()
      ore.destroy()

    setTimeout =>
      Ores.refresh()
    , 200

class ForgeCraft.Collections.Forgings extends Backbone.Collection
  
  model: ForgeCraft.Models.Forgeable
  url: ->
    "/forges/" + window.forge.get("id") + "/loot.json"

  onRender: ->
    @reset()

  forge: (forgeable) ->
    console.log "Forging", forgeable
    forgeable.forge()