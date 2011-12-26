class ForgeCraft.Views.GuardView extends Backbone.View

  events:
    mousedown: "attack"
    touchstart: "attack"

  zone: ->
    $('.zone.' + @guard)

  attack: ->
    self = @

    l = @zone().position().left
    r = l + @zone().width()

    console.log "Zone bounds l:", l, "r:", r

    $('.target.' + @guard + ':visible').each (i, t) ->
      tl = $(t).position().left
      console.log "target position left", tl
      if tl > l and tl < r
        $(t).remove()
        enemyView[self.guard + "Target"].takeDamage(1)

    @shakeZone()

  shakeZone: ->
    @zone().effect("shake", { times: 3, distance: 4 }, 50)

  takeDamage: (damage) ->
    @(el).effect("shake", { times: 3, distance: 4 }, 50)
