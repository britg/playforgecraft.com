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

  reveal: ->
    self = @
    
    loadingView.show()
    $(self.el).load "/forges/" + forge.get("id") + "/enemies/" + self.model.get("id"), ->
      loadingView.hide()
      self.createGuards()
      self.createTargets()

      $(self.el).fadeIn ->
        self.start()


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
    wait = 500 + Math.random() * 3000
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