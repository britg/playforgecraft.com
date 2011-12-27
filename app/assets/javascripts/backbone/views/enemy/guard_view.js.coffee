class ForgeCraft.Views.GuardView extends Backbone.View

  events:
    mousedown: "attack"
    touchstart: "attack"
    mousemove: "cancelScroll"
    touchmove: "cancelScroll"

  initialize: ->
    @model.bind "change:defense", @takeDamage, @

  lane: ->
    enemyView[@guard + "Lane"]

  zone: ->
    $('.zone.' + @guard)

  targets: ->
    $('.target.' + @guard + ':visible')

  attack: ->
    @determineHit target for target in @targets()
    @activateZone()
    false

  determineHit: (target) ->
    if @inZone(target)
      @lane().destroyTarget(target.id)
      @model.hit()

  inZone: (target) ->
    $actual     = $('#' + target.id)
    targetLeft  = $actual.position().left
    targetRight = targetLeft + $actual.width()
    zoneLeft    = @zone().position().left
    zoneRight   = zoneLeft + @zone().width()

    leftIn  = (targetLeft >= zoneLeft) and (targetLeft <= zoneRight)
    rightIn = (targetRight >= zoneLeft) and (targetRight <= zoneRight)

    leftIn or rightIn

  activateZone: ->
    @zone().effect("pulsate", { times: 3, }, 50)

  takeDamage: (damage) ->
    $(@el).effect("shake", { times: 3, distance: 4 }, 50)

  cancelScroll: ->
    false
