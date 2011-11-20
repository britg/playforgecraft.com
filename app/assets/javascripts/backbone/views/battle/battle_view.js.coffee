class ForgeCraft.Views.BattleView extends Backbone.View

  initialize: ->

    @render()
    @bindActionResponse()

  render: ->

    battleHeight = $(window).height() - $('.topbar').height()
    $('#battle').css height: battleHeight
    $('.battler-wrap').css height: battleHeight
    $('.log').css height: battleHeight

  bindActionResponse: ->
    self = @

    $('#new_action').bind 'ajax:complete', (event, response) ->
      action_params = JSON.parse(response.responseText)
      console.log "New action created!", action_params
      self.model.log_action(action_params)

    @model.actions.bind "add", @displayNewAction, @

  displayNewAction: (action) ->

    console.log "Displaying new action!", action
    $('.action-list').prepend('<li class="log-action">' + action.get("to_log") + '</li>')
    $('#battle_action_message').val('')
