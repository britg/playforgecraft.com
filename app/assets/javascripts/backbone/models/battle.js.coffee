class ForgeCraft.Models.Battle extends Backbone.Model

  defaults:
    mode: "singleplayer"

  initialize: ->
    @actions = new ForgeCraft.Collections.Actions

  log_action: (params) ->
    @actions.add params


class ForgeCraft.Collections.Battles extends Backbone.Collection

  model:  ForgeCraft.Models.Battle
  url:    '/battles'