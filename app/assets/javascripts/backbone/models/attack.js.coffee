class ForgeCraft.Models.Attack extends Backbone.Model

  defaults:
    matched: false
    type: 'warrior1'
    x: 0
    y: 0

  initialize: ->
    @bind "add", @cache, @
    @bind "change", @cache, @

  cache: ->
    battle.grid.cache @

class ForgeCraft.Collections.Grid extends Backbone.Collection

  model: ForgeCraft.Models.Attack
  attackCache: [[]]

  ROWS: 8
  COLS: 8
  ATTACK_WIDTH: 64
  ATTACK_HEIGHT: 64 

  WARRIOR1: 'warrior1'
  SHIELDBASH: 'shieldbash'
  THIEF1: 'thief1'
  THIEF2: 'thief2'
  RANGER: 'ranger'

  initialize: ->
    @attackTypes = [@WARRIOR1, @SHIELDBASH, @THIEF1, @THIEF2, @RANGER]

  seed: ->
    for row in [0..@ROWS-1]
      for col in [0..@COLS-1]
        type = @chooseAttackType()
        attack = new ForgeCraft.Models.Attack x: col, y: row, type: type
        @add(attack)

  chooseAttackType: ->
    i = Math.floor(Math.random()*@attackTypes.length)
    @attackTypes[i]

  cache: (attack) ->
    x = attack.get('x')
    y = attack.get('y')
    @attackCache[x] = [] unless @attackCache[x]?
    @attackCache[x][y] = attack

  attackAt: (x, y) ->
    return undefined unless @attackCache[x]?
    @attackCache[x][y]

  attemptMove: (attack, direction) ->
    x = attack.get("x")
    y = attack.get("y")

    switch direction
      when "right" then x += 1
      when "left" then x -= 1
      when "up" then y -= 1
      when "down" then y += 1

    swapAttack = @attackAt(x, y)
    console.log("Swapping attack", attack, direction, swapAttack)
    @swapAttacks(attack, swapAttack)

  swapAttacks: (attack, swap) ->
    attackX = attack.get('x')
    attackY = attack.get('y')
    swapX = swap.get('x')
    swapY = swap.get('y')

    attack.set x: swapX, y: swapY
    swap.set x: attackX, y: attackY