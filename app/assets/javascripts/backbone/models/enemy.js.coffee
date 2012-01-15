class ForgeCraft.Models.Enemy extends Backbone.Model

  initialize: ->
    @bind "change:defense", @detectDeath, @
    @bind "tick", @tick

  takeAttack: (type, count) ->
    console.log @get("name"), "taking", count, "x", type
    return @takeShieldBash(count) if type == 'shieldbash'

    base = ForgeCraft.Config.attacks[type]

    if count > 3
      dmg = Math.round(Math.random() * 2 * base) + base
      critical = true
    else
      dmg = Math.round(Math.random() * base)
      critical = false
    
    newLife = @get("defense") - dmg
    newLife = 0 if newLife < 0

    @set defense: newLife
    @trigger "damage_taken", type, dmg, critical
    console.log "Taking damage", dmg

  lifePercent: ->
    Math.round(@get("defense")/@get("original_defense")*100)

  takeShieldBash: (count) ->
    next = @get("next_attack") + count
    @set next_attack: next
    @trigger "shieldbash_taken"

  detectDeath: ->
    @die() if @get("defense") < 1

  die: ->
    battle.win()

  tick: ->
    next = @get('next_attack') - 1
    return @queueAttack() if next == 0
    @set next_attack: next

  queueAttack: ->
    battle.grid.lock()
    battle.queueEnemyAttack()

  attack: ->
    dmg = Math.round(@get("attack") * Math.random() + @get("attack")/2)
    player.takeDamage(dmg)
    @set 'next_attack': @get('attack_interval')
    @trigger 'attack'
    battle.grid.compress()
    battle.grid.unlock()
