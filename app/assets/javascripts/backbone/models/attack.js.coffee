class ForgeCraft.Models.Attack extends Backbone.Model

  defaults:
    matched: false
    type: 'warrior1'
    x: -1
    y: -1

  initialize: ->
    @bind "add", @cache, @
    @bind "change", @cache, @

  cache: ->
    battle.grid.cache @

  remove: ->
    battle.grid.consume @
    battle.grid.remove @

  dropTo: (y) -> 
    battle.grid.consume(@)
    @set y: y

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
    @holes = []
    @attackTypes = [@WARRIOR1, @WARRIOR1, @WARRIOR1, @SHIELDBASH, @THIEF1, @THIEF1, @THIEF2, @RANGER]

  seed: ->
    @prev = @chooseRandomAttackType()

    for row in [0..@ROWS-1]
      for col in [0..@COLS-1]
        type = @chooseAttackType(row, col)
        attack = new ForgeCraft.Models.Attack x: col, y: row, type: type
        @add(attack)

  chooseAttackType: (row, col) ->
    chosen = @prev
    @prevAttack = @attackAt(col, row-1)
    @prevRow = @prevAttack.get("type") if @prevAttack?

    while chosen == @prev or chosen == @prevRow
      chosen = @chooseRandomAttackType()

    return @prev = chosen

  chooseRandomAttackType: ->
    i = Math.floor(Math.random()*@attackTypes.length)
    @attackTypes[i]

  cache: (attack) ->
    x = attack.get('x')
    y = attack.get('y')
    @attackCache[x] = [] unless @attackCache[x]?
    @attackCache[x][y] = attack
  
  uncache: (attack) ->
    x = attack.get('x')
    y = attack.get('y')
    @attackCache[x] = [] unless @attackCache[x]?
    @attackCache[x][y] = undefined    

  consume: (attack) ->
    @uncache attack
    col = attack.get('x')
    @holes.push(col) unless _.include(@holes, col)

  fillHoles: ->
    return unless @holes.length > 0

    for x in @holes
      @applyGravityAt(x, y) for y in [@ROWS-2 .. 0]
      @backFillAt(x, y) for y in [@ROWS-2 .. 0]
      _.reject @holes, (col) -> col == x

    setTimeout =>
      @detectMatches()
    , 500

  applyGravityAt: (x, y) ->
    # console.log "Checking ore at", x, ",", y
    return unless attack = @attackAt(x, y)

    # check ore below this one
    blocked = false
    dy = y
    blocked = @blockage(x, ++dy) while !blocked

    attack.dropTo(dy-1) if blocked and (dy-1)!=y

  backFillAt: (x, y) ->
    return if @attackAt(x, y)

    type = @chooseAttackType(y, x)
    filler = new ForgeCraft.Models.Attack type: type
    @add(filler)
    filler.set x: x, y: y,

  blockage: (x, y) ->
    @attackAt(x, y)? or y >= @ROWS

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

    unless @detectMatches()
      swap.set x: swapX, y: swapY
      attack.set x: attackX, y: attackY

  detectMatches: ->
    @atLeastOneMatch = false
    @matchSets = []
    @matches = []
    @detectRowMatches()
    @detectColMatches()
    battle.queueAttacks(@matchSets)
    return @atLeastOneMatch

  detectRowMatches: ->
    for row in [0..@ROWS-1]
      for col in [0..@COLS-1]
        @test(row, col, 'right')

  detectColMatches: ->
    for col in [0..@COLS-1]
      for row in [0..@ROWS-1]
        @test(row, col, 'down')

  test: (row, col, direction) ->
    me = @attackAt(col, row)

    if direction == 'right'
      them = @attackAt(col+1, row)

    if direction == 'down'
      them = @attackAt(col, row+1)

    if me? and them? and (me.get("type") == them.get("type"))
      @addMatch(me, them) 
    else
      @testMatches() 


  addMatch: (attack1, attack2) ->
    @matches.push(attack1) unless _.include(@matches, attack1)
    @matches.push(attack2) unless _.include(@matches, attack2)

  testMatches: ->
    if @matches.length > 2
      @atLeastOneMatch = true
      attack.set({matched: true}) for attack in @matches
      @matchSets.push @matches

    @matches = []
