class ForgeCraft.Views.HeroView extends Backbone.View

  tagName: 'div'
  className: '.hero'

  initialize: ->
    console.log "Initializing hero view", @model
    @model.bind "change:active", @reflectActiveState, @

  reflectActiveState: ->
    console.log "Reflecting active state", @model
    if @model.get("active")
      @activate()
    else
      @deactivate()

  activate: ->
    $(@el).addClass("active")
    @bindActions()

  deactivate: ->
    $(@el).removeClass("active")
    @unbindActions()

  bindActions: ->
    self = @
    $(@el).find('.action').bind 'click', (event) ->
      console.log "On action choice", event
      actionName = $(event.target).attr("data-action")
      self.beginAction(actionName)
      return false

  unbindActions: ->
    $(@el).find('.action').unbind 'click'

  beginAction: (actionName) ->
    console.log "Beginning action", actionName

    if actionName == 'attack'
      @beginAttack()

  beginAttack: ->
    self = @
    $(@el).find('.actions').hide()
    @showExplanation('attack')
    battleView.enableActionTargets ->
      self.chooseAttackTarget.apply(self, arguments)

  chooseAttackTarget: (enemyView) ->
    console.log "Choosing attack target", enemyView

    enemy = enemyView.model
    @model.chooseAttackTarget(enemy)

    @showExplanation('target', "Attacking " + enemy.get("name"))

  beginDefend: ->

  beginSteal: ->

  doMultishot: ->

  showExplanation: (className, content) ->
    @hideExplanation()
    $(@el).find('.explanation.' + className).show().find('.content').html(content)

  hideExplanation: ->
    $(@el).find('.explanation').hide()

  enableActionTarget: (callback) ->
    self = @
    $(@el).addClass('action-target')
    $(@el).css cursor: "pointer"
    $(@el).click ->
      battleView.disableActionTargets()
      if callback?
        callback.apply(@, [self])

  disableActionTarget: ->
    $(@el).removeClass('action-target')
    $(@el).css cursor: "inherit"
    $(@el).unbind 'click'
    