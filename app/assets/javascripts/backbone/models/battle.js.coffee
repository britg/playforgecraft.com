class ForgeCraft.Models.Battle extends Backbone.Model

  defaults:
    mode: "singleplayer"

    controllableWarrior: null
    controllableThief: null
    controllableRanger: null

    enemyWarrior: null
    enemyThief: null
    enemyRanger: null

    currentPlay: null

  initialize: ->
    @actions = new ForgeCraft.Collections.Actions(@get("actions"))
    @pendingActions = new ForgeCraft.Collections.Actions
    @initializeHeroes()
    @bind "ForgeCraft::PlayComplete", @continue, @

  log_action: (params) ->
    @actions.add params

  initializeHeroes: ->
    
    @set 
      controllableWarrior: new ForgeCraft.Models.Hero(@get("first_warrior"))
      controllableThief: new ForgeCraft.Models.Hero(@get("first_thief"))
      controllableRanger: new ForgeCraft.Models.Hero(@get("first_ranger"))
      enemyWarrior: new ForgeCraft.Models.Hero(@get("second_warrior"))
      enemyThief: new ForgeCraft.Models.Hero(@get("second_thief"))
      enemyRanger: new ForgeCraft.Models.Hero(@get("second_ranger"))

  continue: ->

    if @get("currentPlay")?
      nextPlay = @get("currentPlay") + 1
    
    else
      lastAction = @getLastAction()
      nextPlay = 0
      if lastAction?
        nextPlay = lastAction.get("play")+1

    if nextPlay > (@get("plays").length - 1)
      nextPlay = 0

    console.log "Continuing with next play: ", nextPlay

    @runPlay(nextPlay)

  getLastAction: ->
    num_actions = @actions.length

    if num_actions > 0
      return @actions.at(num_actions-1)
    return null

  runPlay: (play_index) ->
    play = @get("plays")[play_index]

    console.log "Running play", play
    @set currentPlay: play_index

    if play.player == 1
      if play.hero == "warrior"
        @get("controllableWarrior").runPlay play.action
      else if play.hero == "thief"
        @get("controllableThief").runPlay play.action
      else if play.hero == "ranger"
        @get("controllableRanger").runPlay play.action
    else if play.player == 0
      @fastForward()

  fastForward: ->
    console.log "Synching pending actions and fast forwarding", @pendingActions
    @pendingActions.commitActions()

class ForgeCraft.Collections.Battles extends Backbone.Collection

  model:  ForgeCraft.Models.Battle
  url:    '/battles'