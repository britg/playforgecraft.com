class ForgeCraft.Models.Battle extends Backbone.Model

  PRE_STATE: 'pre'
  PLAY_STATE: 'play'
  PAUSE_STATE: 'pause'

  ROWS: 8
  COLS: 8
  ATTACK_WIDTH: 64
  ATTACK_HEIGHT: 64

  initialize: (params) ->
    @enemy = new ForgeCraft.Models.Enemy(params.enemy)
    @set state: @PRE_STATE

  start: ->
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
