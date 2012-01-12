class ForgeCraft.Models.Battle extends Backbone.Model

  PRE_STATE: 'pre'
  PLAY_STATE: 'play'
  PAUSE_STATE: 'pause'

  QUEUE_START_DELAY: 500
  QUEUE_SPEED: 400

  initialize: (params) ->
    @attackQueue = []
    @processingAttackQueue = false
    @enemy = new ForgeCraft.Models.Enemy(params.enemy)
    @set state: @PRE_STATE

  start: ->
    @grid = new ForgeCraft.Collections.Grid
    @grid.seed()

    @trigger 'battle:start'
    @set state: @PLAY_STATE

  play: ->
    @set state: @PLAY_STATE

  isPlaying: ->
    @get("state") == @PLAY_STATE

  pause: ->
    @set state: @PAUSE_STATE

  isPaused: ->
    @get("state") == @PAUSE_STATE

  queueAttacks: (sets) ->
    @attackQueue.push(set) for set in sets
    setTimeout =>
      @startAttackQueue()
    , @QUEUE_START_DELAY

  startAttackQueue: ->
    return if @processingAttackQueue
    @processAttacks()

  processAttacks: ->
    @processingAttackQueue = @attackQueue.length > 0
    unless @processingAttackQueue
      return 

    set = @attackQueue.shift()
    @processAttack(set)

    if @attackQueue.length < 1
      @grid.fillHoles()

    setTimeout =>
      @processAttacks()
    , @QUEUE_SPEED

  processAttack: (set) ->
    type = set[0].get("type")
    console.log "Processing attack of type", type
    @enemy.takeAttack(type, set.length)

    attack.remove() for attack in set

