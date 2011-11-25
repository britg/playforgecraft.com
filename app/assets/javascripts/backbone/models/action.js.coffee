class ForgeCraft.Models.Action extends Backbone.Model
  

class ForgeCraft.Collections.Actions extends Backbone.Collection

  model:  ForgeCraft.Models.Action
  url:    ->
    battle.get("_id") + "/actions"

  commitActions: ->

    params = { actions: [] }

    @each (model) ->
      params.actions.push model.toJSON()

    uri = @url() + '/commit'

    loadingView.show()
    
    $.post uri, params, (response) ->

      $.each response, (i, actionData) ->
        action = new ForgeCraft.Models.Action(actionData)
        battle.queuedActions.add action

      loadingView.hide()

    @reset()