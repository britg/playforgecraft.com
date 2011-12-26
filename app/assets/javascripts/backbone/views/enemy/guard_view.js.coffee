class ForgeCraft.Views.GuardView extends Backbone.View

  events:
    mousedown: "attack"
    # touchstart: "attack"

  targetLane: ->
    enemyView[@guard + "Target"]

  zone: ->
    $('.zone.' + @guard)

  attack: ->
    self = @

    l = @zone().position().left
    r = l + @zone().width()

    console.log "Zone bounds l:", l, "r:", r

    $('.target.' + @guard + ':visible').each (i, t) ->
      tl = $('#' + t.id).position().left
      console.log "target position left", tl
      if tl > l and tl < r
        self.targetLane().destroyTarget(t.id)

        setTimeout ->
          enemyView.takeDamage(1)
        , 200

    @activateZone()

  activateZone: ->
    @zone().effect("pulsate", { times: 3, }, 50)

  takeDamage: (damage) ->
    $(@el).effect("shake", { times: 3, distance: 4 }, 50)
