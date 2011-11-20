class ForgeCraft.Models.Action extends Backbone.Model

  defaults: 
    player_id: ->
      window.player.get("id")

  

class ForgeCraft.Collections.Actions extends Backbone.Collection

  model:  ForgeCraft.Models.Action
  url:    ->
    @battle.id + "/actions"