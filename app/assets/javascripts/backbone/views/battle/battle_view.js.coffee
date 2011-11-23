class ForgeCraft.Views.BattleView extends Backbone.View

  controllableWarriorView: null
  controllableThiefView: null
  controllableRangerView: null

  enemyWarriorView: null
  enemyThiefView: null
  enemyRangerView: null

  initialize: ->

    @render()
    @bindActionResponse()
    @bindWindowResize()

    @initializeHeroViews()

  render: ->

    battleHeight = $(window).height() - $('.topbar').height()
    $('#battle').css height: battleHeight
    $('.squad-wrap').css height: battleHeight
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

  initializeHeroViews: ->

    @controllableWarriorView = new ForgeCraft.Views.HeroView el: $('.hero.warrior.controllable').get(0), model: @model.get("controllableWarrior")
    @controllableThiefView = new ForgeCraft.Views.HeroView el: $('.hero.thief.controllable').get(0), model: @model.get("controllableThief")
    @controllableRangerView = new ForgeCraft.Views.HeroView el: $('.hero.ranger.controllable').get(0), model: @model.get("controllableRanger")

    @enemyWarriorView = new ForgeCraft.Views.HeroView el: $('.hero.warrior.enemy').get(0), model: @model.get("enemyWarrior")
    @enemyThiefView = new ForgeCraft.Views.HeroView el: $('.hero.thief.enemy').get(0), model: @model.get("enemyThief")
    @enemyRangerView = new ForgeCraft.Views.HeroView el: $('.hero.ranger.enemy').get(0), model: @model.get("enemyRanger")

  enableActionTargets: (callback) ->
    @enemyWarriorView.enableActionTarget(callback)
    @enemyThiefView.enableActionTarget(callback)
    @enemyRangerView.enableActionTarget(callback)

  disableActionTargets: ->
    @enemyWarriorView.disableActionTarget()
    @enemyThiefView.disableActionTarget()
    @enemyRangerView.disableActionTarget()

  
