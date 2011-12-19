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
      self.setNeighbors(ore)

  setNeighbors: (ore) ->
    x = ore.get("x")
    y = ore.get("y")
    n = []

    # top
    if @hasOreAt(x, y-1)
      n.push "top"

    # right
    if @hasOreAt(x+1, y)
      n.push "right"

    # bottom
    if @hasOreAt(x, y+1)
      n.push "bottom"

    # left
    if @hasOreAt(x-1, y)
      n.push "left"

    ore.set neighbors: n

  hasOreAt: (x, y) ->
    hasOre = false
    $.each @get("ores"), (i, ore) ->
      hasOre = (ore.get("x") == x and ore.get("y") == y)
      return false if hasOre
    hasOre

  toJSON: ->
    forging:
      classification: @get("classification")
      ore: @get("ore")
      ore_count: @get("ores").length
      accuracy: @get("accuracy")

  forge: (accuracy) ->
    return if @forging
    @forging = true
    @set accuracy: accuracy
    Ores.clearForgeables()
    @markOres()
    console.log "Forging with accuracy", @get("accuracy")
    @save @toJSON, success: @convertToLootIfPurchased
    Crafty.audio.play("forge")

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
    eventsView.addEventsHTML(params.new_events_html)
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
    "/forges/" + window.forge.get("id") + "/loot"

  onRender: ->
    @reset()

  forge: (forgeable) ->
    console.log "Forging", forgeable
    forgeable.forge()