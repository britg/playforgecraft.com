class ForgeCraft.Views.EnemyView extends Backbone.View

  initialize: ->
    @el = $('#enemy').get(0)
    @model = forge.enemy
    @targets = ['warrior', 'thief', 'ranger']
    @reveal()

  reveal: ->
    self = @
    $(@el).fadeIn ->
    loadingView.show()
    $(@el).load "/forges/" + forge.get("id") + "/enemies/" + @model.get("id"), ->
      loadingView.hide()
      self.createGuards()
      self.createTargets()
      self.start()

  createGuards: ->
    @warrior = new ForgeCraft.Views.GuardView el: $('#warrior').get(0)
    @warrior.guard = "warrior"
    @thief = new ForgeCraft.Views.GuardView el: $('#thief').get(0)
    @thief.guard = "thief"
    @ranger = new ForgeCraft.Views.GuardView el: $('#ranger').get(0)
    @ranger.guard = "ranger"

  createTargets: ->
    @warriorTarget = new ForgeCraft.Views.TargetView('warrior')
    @thiefTarget = new ForgeCraft.Views.TargetView('thief')
    @rangerTarget = new ForgeCraft.Views.TargetView('ranger')

  start: ->
    console.log "Starting battle!"
    @loop()

  loop: ->
    wait = 500 + Math.random() * 5000
    @loopTimeout = setTimeout =>
      @attack()
      @loop()
    , wait

  attack: ->
    target = @chooseTarget()
    # console.log "Attacking", target
    target.attack()

  chooseTarget: ->
    t = @targets[Math.floor(Math.random()*@targets.length)]
    # console.log "Chose", t
    @[t + "Target"]

  end: ->
    clearTimeout(@loopTimeout)
    $(@el).fadeOut ->
      $('#ores').fadeIn()
      $(@el).html('')

  takeDamage: (damage) ->
    $(@el).find('.bar').effect("shake", { times: 3, distance: 4 }, 50)