class ForgeCraft.Models.Guard extends Backbone.Model

  defaults:
    attack: 10
    defense: 20

  calculateDamage: ->
    attack = parseInt(@get('attack'))
    min = attack * 0.7
    max = attack * 1.3
    diff = max - min
    dmg = Math.round(Math.random()*diff + min)
    return dmg

  hit: ->
    forge.enemy.takeDamage(@calculateDamage())

  takeDamage: (amount) ->
    console.log "Guard took damage:", amount

  