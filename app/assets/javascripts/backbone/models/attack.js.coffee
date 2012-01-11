class ForgeCraft.Models.Attack extends Backbone.Model

  defaults:
    type: 'warrior1'
    x: 0
    y: 0

class ForgeCraft.Collections.Grid extends Backbone.Collection

  model: ForgeCraft.Models.Attack

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