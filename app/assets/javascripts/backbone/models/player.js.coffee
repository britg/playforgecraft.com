class ForgeCraft.Models.Player extends Backbone.Model
  paramRoot: 'player'

  defaults:
    level: 0
    coins: 0
    setting: {}

  initialize: ->
    @bind "change:setting", @updateSetting, @

  equip: (hero_id, slot, loot_id) ->
    console.log "Equipping loot", loot_id

    data =
      _method: "put"
      slot: slot
      loot_id: loot_id

    loadingView.show()
    $.post "/heroes/" + hero_id, data, (response) ->
      console.log "Response from equpping loot", response
      loadingView.hide()
      if $('#facebox').length > 0
        $('#facebox').find('.content').html(response)

  updateSetting: ->
    ForgeCraft.Config.sound.music = @get("setting").music
    ForgeCraft.Config.sound.effects = @get("setting").effects
    Sounds.update()
  
class ForgeCraft.Collections.PlayersCollection extends Backbone.Collection
  model: ForgeCraft.Models.Player
  url: '/players'