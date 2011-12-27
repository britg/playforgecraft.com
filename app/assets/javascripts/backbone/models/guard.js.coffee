class ForgeCraft.Models.Guard extends Backbone.Model

  defaults:
    attack: 10
    defense: 20

  hit: ->
    console.log "Attacking!"

  takeDamage: (amount) ->
    console.log "Ouch! I took damage:", amount
    
  