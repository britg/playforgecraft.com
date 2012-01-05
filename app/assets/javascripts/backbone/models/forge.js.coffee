class ForgeCraft.Models.Forge extends Backbone.Model

  initialize: ->
    @events = new ForgeCraft.Collections.Events ForgeCraft.Config.latest_event

  hasEnoughFunds: (amount) ->
    return yes unless @get("requires_funding")
    @get("funds") > amount
  
  processEventResponse: (params) ->

    if params.player?
      player.set(params.player)

    # Loot
    if params.loot?
      loot = new ForgeCraft.Models.Loot(params.loot)
      Loot.add(loot)

    # Events
    forge.events.add params.new_events.reverse()
    eventsView.addEventsHTML(params.new_events_html)

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
    Sounds.play "forge_item"

  markOres: ->
    $.each @get("ores"), (i, ore) ->
      ore.set marked: true

  unmarkOres: ->
    $.each @get("ores"), (i, ore) ->
      ore.set marked: false    
  
  convertToLootIfPurchased: (forgeable, params) ->
    console.log "Response from server is:", params

    if params.purchased
      forgeable.processEventResponse(params)
    else
      forgeable.unableToPurchase(params)
    
  processEventResponse: (params) ->

    Forgings.remove(@)
    player.set(params.player)
    
    # Ores
    @consumeOres()
    Ores.addReplacements(params.replacements)
    setTimeout ->
      $('.ore').removeClass("unmarked")
    , 500

    # Loot
    loot = new ForgeCraft.Models.Loot(params.loot)
    Loot.add(loot)

    # Events
    forge.events.add params.new_events.reverse()
    eventsView.addEventsHTML(params.new_events_html)

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