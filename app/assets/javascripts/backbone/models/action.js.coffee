class ForgeCraft.Models.Action extends Backbone.Model
  

class ForgeCraft.Collections.Actions extends Backbone.Collection

  model:  ForgeCraft.Models.Action
  url:    ->
    battle.get("_id") + "/actions"

  commitActions: ->
    console.log "Committing actions", @url()

    params = { actions: [] }

    @each (model) ->
      params.actions.push model.toJSON()

    console.log "Params:", params

    uri = @url() + '/commit'

    $.post uri, params, (response) ->
      console.log "Response:", response