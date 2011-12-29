class ForgeCraft.Views.GuardView extends Backbone.View

  events:
    mousedown: "attack"
    touchstart: "attack"
    mousemove: "cancelScroll"
    touchmove: "cancelScroll"

  initialize: ->
    @model.bind "change:defense", @takeDamage, @
    @model.bind "change:alive", @die, @

  lane: ->
    enemyView[@guard + "Lane"]

  zone: ->
    $('.zone.' + @guard)

  targets: ->
    $('.target.' + @guard + ':visible')

  attack: ->
    return if enemyView.ended?
    @determineHit target for target in @targets()
    @activateZone()
    @activateIcon()
    false

  determineHit: (target) ->
    if @inZone(target)
      @lane().destroyTarget(target.id)
      ForgeCraft.Audio.play 'slash'
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

  activateIcon: ->
    $(@el).effect("pulsate", { times: 3, }, 50)

  activateZone: ->
    @zone().effect("pulsate", { times: 3, }, 50)

  takeDamage: (damage) ->
    $(@el).find('.val.defense').html(@model.get("defense"))
    $(@el).effect("shake", { times: 3, distance: 2 }, 50)

  die: ->
    enemyView.removeTarget(@guard)
    setTimeout =>
      @lane().removeFromPlay()
    , 1000

  cancelScroll: ->
    false
