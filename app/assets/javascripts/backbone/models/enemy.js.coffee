class ForgeCraft.Models.Enemy extends Backbone.Model

  defaults:
    name: "Enemy"
    attack: 10
    defense: 20

  initialize: ->
    console.log "Initializing enemy!", @
    @originalDefense = @get("defense")

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

  takeDamage: (amount) ->
    return if @done?
    console.log "Enemy took damage:", amount
    curr_defense = @get("defense")
    new_defense = curr_defense - amount
    if new_defense <= 0
      new_defense = 0
      @die()
    
    @set defense: new_defense

  defensePercent: ->
    Math.round((@get("defense")/@originalDefense) * 100)

  die: ->
    return if @done?
    @done = true
    params =
      _method: "put"
      winner: "player"

    $.post "/forges/" + forge.get("id") + "/enemies/" + @get("id"), params, (response) ->
      forge.processEventResponse(response)
      forgeView.endFight('win')

    return false

  win: ->
    return if @done?
    @done = true
    params =
      _method: "put"
      winner: "enemy"

    $.post "/forges/" + forge.get("id") + "/enemies/" + @get("id"), params, (response) ->
      forge.processEventResponse(response)
      forgeView.endFight('loss')

    return false


class ForgeCraft.Collections.Enemies extends Backbone.Collection

  model: ForgeCraft.Models.Enemy
  url: ->
    "/forges/" + forge.get("id") + "/enemies"