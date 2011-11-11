class ForgeCraft.Models.Loot extends Backbone.Model

  defaults:
    name: ""
    rarity: ""
    ore: ""

  sell: ->
    self = @
    loadingView.show()
    @destroy success: (model, response) ->
      player.set(response.player)
      loadingView.hide()

class ForgeCraft.Collections.Loot extends Backbone.Collection

  model: ForgeCraft.Models.Loot
  url: '/loot'

  comparator: (loot) ->
    -parseInt(loot.get("id"))

  fetchMore: (count = 1)->
    last = @at @length-1
    @fetch data: {last: last.get("id"), limit: count}, add: true
  