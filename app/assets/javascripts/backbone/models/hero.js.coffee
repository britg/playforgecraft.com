class ForgeCraft.Models.Hero extends Backbone.Model

  defaults:
    name: "Hero"
    attack: 0
    defense: 0
    active: false

  runPlay: (playName) ->
    console.log "Hero running play", playName
    @chooseAction() if playName == 'choose_action'

  chooseAction: ->
    @activate()

  activate: ->
    console.log "Activating hero"
    @set active: true

  deactivate: ->
    console.log "Deactivating hero"
    @set active: false

  chooseAttackTarget: (enemy) ->
    @deactivate()
    action = new ForgeCraft.Models.Action type: "attack", play: battle.get("currentPlay"), target_id: enemy.get("id"), target_name: enemy.get("name"), hero_id: @get("id"), hero_name: @get("name")
    battle.pendingActions.add action
    battle.trigger "ForgeCraft::PlayComplete"