class ForgeCraft.Views.EnemyView extends Backbone.View

  mousedown: "cancelScroll"
  touchdown: "cancelScroll"
  mousemove: "cancelScroll"
  touchmove: "cancelScroll"

  initialize: ->
    @model = forge.enemy
    @targets = ['warrior', 'thief', 'ranger']
    @reveal()

    @model.bind "change:defense", @takeDamage, @

    @bindKeys()

  bindKeys: ->
    $(window).bind 'keydown', @activateGuard

  unbindKeys: ->
    $(window).unbind 'keydown', @activateGuard

  activateGuard: (e) ->
    console.log e.which, e.keyCode

    if e.which == 49 or e.keyCode == 49
      enemyView.guards[0].attack()
    if e.which == 50 or e.keyCode == 50
      enemyView.guards[1].attack()
    if e.which == 51 or e.keyCode == 51
      enemyView.guards[2].attack()

    return
      

  reveal: ->
    self = @
    
    loadingView.show()
    $(self.el).load "/forges/" + forge.get("id") + "/enemies/" + self.model.get("id"), ->
      loadingView.hide()
      self.createGuards()
      self.createTargets()
      self.bindFleeButton()

      $(self.el).fadeIn ->
        self.start()

  bindFleeButton: ->
    $('.flee').click ->
      forge.enemy.win()
      return false

  createGuards: ->
    warrior_attack = parseInt($('#warrior').attr("data-attack"))
    warrior_defense = parseInt($('#warrior').attr("data-defense"))
    @warrior = new ForgeCraft.Models.Guard attack: warrior_attack, defense: warrior_defense
    @warriorView = new ForgeCraft.Views.GuardView el: $('#warrior').get(0), model: @warrior
    @warriorView.guard = "warrior"

    thief_attack = parseInt($('#thief').attr("data-attack"))
    thief_defense = parseInt($('#thief').attr("data-defense"))
    @thief = new ForgeCraft.Models.Guard attack: thief_attack, defense: thief_defense
    @thiefView = new ForgeCraft.Views.GuardView el: $('#thief').get(0), model: @thief
    @thiefView.guard = "thief"

    ranger_attack = parseInt($('#ranger').attr("data-attack"))
    ranger_defense = parseInt($('#ranger').attr("data-defense"))
    @ranger = new ForgeCraft.Models.Guard attack: ranger_attack, defense: ranger_defense
    @rangerView = new ForgeCraft.Views.GuardView el: $('#ranger').get(0), model: @ranger
    @rangerView.guard = "ranger"

    @guards = []
    $('.lane').each (i, lane) =>
      which = $(lane).find('.hero').attr("id")
      if which == "warrior"
        @guards.push @warriorView
      else if which == "thief"
        @guards.push @thiefView
      else if which == "ranger"
        @guards.push @rangerView

  createTargets: ->
    @warriorLane = new ForgeCraft.Views.LaneView('warrior')
    @warriorLane.model = @warrior
    @thiefLane = new ForgeCraft.Views.LaneView('thief')
    @thiefLane.model = @thief
    @rangerLane = new ForgeCraft.Views.LaneView('ranger')
    @rangerLane.model = @ranger

  start: ->
    console.log "Starting battle!"

    setTimeout =>
      splashView.queueMessage "Battle!"
      @loop()
    , 1000

  loop: ->
    wait = 500 + Math.random() * 2000
    @loopTimeout = setTimeout =>
      @attack()
      @loop()
    , wait

  attack: ->
    lane = @chooseLane()
    lane.attack()

  chooseLane: ->
    t = @targets[Math.floor(Math.random()*@targets.length)]
    # console.log "Chose", t
    @[t + "Lane"]

  end: ->
    @model.dead = true
    clearTimeout(@loopTimeout)
    $(@el).fadeOut ->
      $('#ores').fadeIn()
      $(@el).html('')

  takeDamage: (damage) ->
    per = @model.defensePercent() + "%"
    $(@el).find('.bar-wrap').effect("shake", { times: 3, distance: 4 }, 50)
    $(@el).find('.bar').css width: per
    $(@el).find('.enemy').find('.val.defense').html(@model.get("defense"))

  removeTarget: (guard) ->
    i = @targets.indexOf(guard)
    if i >= 0
      @targets.splice(i, 1)

    if @targets.length < 1
      setTimeout =>
        @model.win()
      , 1000

  cancelScroll: ->
    false