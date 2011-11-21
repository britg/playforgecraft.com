class ForgeCraft.Views.BattleView extends Backbone.View

  initialize: ->

    @render()
    @bindActionResponse()
    @bindWindowResize()

  render: ->

    battleHeight = $(window).height() - $('.topbar').height()
    $('#battle').css height: battleHeight
    $('.battler-wrap').css height: battleHeight
    logHeight = $('.log').height()

    if logHeight < battleHeight
      $('.log').css minHeight: battleHeight

  bindWindowResize: ->
    self = @
    unless Modernizr.touch
      $(window).unbind('resize').resize ->
        self.render()

  bindActionResponse: ->
    self = @

    $('#new_action').bind 'ajax:complete', (event, response) ->
      action_params = JSON.parse(response.responseText)
      console.log "New action created!", action_params
      self.model.log_action(action_params)

    @model.actions.bind "add", @displayNewAction, @

  displayNewAction: (action) ->

    actionView = new ForgeCraft.Views.ActionView model: action
    actionView.render()

    $('#battle_action_message').val('')