class ForgeCraft.Models.Enemy extends Backbone.Model

  defaults:
    name: "Enemy"
    attack: 10
    defense: 20

  initialize: ->
    console.log "Initializing enemy!", @

  start: ->
    forgeView.startFight()

  calculateDamage: ->
    attack = parseInt(@get('attack'))
    min = attack * 0.7
    max = attack * 1.3
    diff = max - min
    dmg = Math.round(Math.random()*diff + min)
    return dmg

  hit: (guard) ->
    guard.takeDamage(@calculateDamage())

  win: ->
    params =
      _method: "put"
      winner: "enemy"

    $.post "/forges/" + forge.get("id") + "/enemies/" + @get("id"), params, (response) ->
      forge.processEventResponse(response)
      forgeView.endFight()

    return false


class ForgeCraft.Collections.Enemies extends Backbone.Collection

  model: ForgeCraft.Models.Enemy
  url: ->
    "/forges/" + forge.get("id") + "/enemies"