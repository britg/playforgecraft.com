class ForgeCraft.Models.Loot extends Backbone.Model

  defaults:
    name: ""
    rarity: ""
    ore: ""

  cashIn: ->
    @destroy success: (model, response) =>
      player.set(response.player)

class ForgeCraft.Collections.Loot extends Backbone.Collection

  model: ForgeCraft.Models.Loot
  url: '/loot'

  initialize: ->

    @bind "destroy", @backfill, @

  comparator: (loot) ->
    -parseInt(loot.get("id"))

  backfill: ->
    last = @at @length-1
    @fetch data: {last: last.get("id"), limit: 1}, add: true
  