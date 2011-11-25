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

    finished: false

  initialize: ->
    
    # Actions that have been committed to the server (do not need to be replayed)
    @actions = new ForgeCraft.Collections.Actions(@get("actions"))

    # Actions that have not been sent to the server
    @pendingActions = new ForgeCraft.Collections.Actions

    # Actions returned from the server
    @queuedActions = new ForgeCraft.Collections.Actions
    @queuedActions.bind "add", @processQueue, @

    @initializeHeroes()
    @bind "ForgeCraft::PlayComplete", @continue, @

    @actions.bind "add", @setCurrentPlayFromAction, @

  log_action: (params) ->
    @actions.add params

  initializeHeroes: ->
    
    @heroes = new ForgeCraft.Collections.Heroes()

    @set 
      controllableWarrior: new ForgeCraft.Models.Hero(@get("first_warrior"))
      controllableThief: new ForgeCraft.Models.Hero(@get("first_thief"))
      controllableRanger: new ForgeCraft.Models.Hero(@get("first_ranger"))
      enemyWarrior: new ForgeCraft.Models.Hero(@get("second_warrior"))
      enemyThief: new ForgeCraft.Models.Hero(@get("second_thief"))
      enemyRanger: new ForgeCraft.Models.Hero(@get("second_ranger"))

    @heroes.add [@get("controllableWarrior"), @get("controllableThief"),
                @get("controllableRanger"),  @get("enemyWarrior"),
                @get("enemyThief"),  @get("enemyRanger")]

  continue: ->
    return if @get("finished") == true

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

  setCurrentPlayFromAction: ->
    @set currentPlay: @getLastAction().get("play")

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

  processQueue: ->
    if battle.queuedActions.length < 1
      @continue()
      return

    clearTimeout(@queueTimeout)

    @queueTimeout = setTimeout ->
      console.log "Processing Queue!"
      action = battle.queuedActions.at(0)
      battle.queuedActions.remove(action)
      battle.processAction(action)
      battle.processQueue()
    , 1000

  stopQueue: ->
    clearTimeout(@queueTimeout)

  clearQueue: ->
    @queuedActions.reset()

  processAction: (action) ->
    console.log "Processing action:", action
    battle.actions.add action

    if action.get("hero")?
      console.log "Updating hero conditions"
      hero = battle.heroes.get(action.get("hero_id"))
      hero.set action.get("hero_conditions")
      hero.set last_action: action.get("id")

    if action.get("targetted")?
      console.log "Updating target conditions", action.get("target_id"), action.get("target_conditions")
      hero = battle.heroes.get(action.get("target_id"))
      hero.set action.get("target_conditions")

    if action.get("conditions")?
      console.log "Updating battle condiitons", action.get("conditions")
      battle.set action.get("conditions")


class ForgeCraft.Collections.Battles extends Backbone.Collection

  model:  ForgeCraft.Models.Battle
  url:    '/battles'