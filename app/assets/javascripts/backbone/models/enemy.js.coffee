class ForgeCraft.Models.Enemy extends Backbone.Model

  initialize: ->
    @bind "change:defense", @detectDeath, @

  takeAttack: (type, count) ->
    console.log @get("name"), "taking", count, "x", type
    return @takeShieldBash() if type == 'shieldbash'

    dmg = ForgeCraft.Config.attacks[type]
    
    newLife = @get("defense") - dmg
    newLife = 0 if newLife < 0

    @set defense: newLife
    @trigger "damage_taken", type, dmg
    console.log "Taking damage", dmg

  lifePercent: ->
    Math.round(@get("defense")/@get("original_defense")*100)

  takeShieldBash: ->
    console.log "Taking shield bash!"
    @trigger "shieldbash_taken"

  detectDeath: ->
    @die() if @get("defense") < 1

  die: ->
    battle.win()