class ForgeCraft.Models.Loot extends Backbone.Model

  defaults:
    name: ""
    rarity: ""
    ore: ""

  sell: ->
    self = @
    
    @destroy success: (model, response) ->
      player.set(response.player)
      loadingView.hide()

class ForgeCraft.Collections.Loot extends Backbone.Collection

  model: ForgeCraft.Models.Loot
  url: '/loot'

  fetchLootLock: off

  comparator: (loot) ->
    -parseInt(loot.get("id"))

  fetchMore: (count = 1) ->
    console.log "Attempting to fetch more loot", @fetchLootLock
    return if @fetchLootLock is on
    @activateFetchLootLock()
    last = @at @length-1
    @fetch data: {last: last.get("id"), forge_id: forge.get("id"), limit: count}, add: true, success: @releaseFetchLootLock

  activateFetchLootLock: ->
    console.log "Activating fetch loot lock"
    Loot.fetchLootLock = on

  releaseFetchLootLock: (collection, response) ->
    console.log "Releasing fetch loot lock"
    if response.length < 1
      forgeView.reflectBottomOfLootList()
    Loot.fetchLootLock = off

  sell: (loot_id) ->
    loadingView.show()

    loot = @get(loot_id)

    unless loot? 
      loot = new ForgeCraft.Models.Loot id: loot_id
      window.Loot.add(loot)

    loot.sell()
  