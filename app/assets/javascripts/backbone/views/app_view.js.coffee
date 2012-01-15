class ForgeCraft.Views.AppView extends Backbone.View

  initialize: ->
    @startHistory()
    @bindInternalLinks()
    @bindAlerts()
    @startAppContext(window.location.pathname)
    @resetLoadTriggers()

  resetLoadTriggers: ->
    @faded = false
    @loaded = false

  load: (path, callback) ->
    self = @
    flashView.hide()
    loadingView.show()
    $(window).unbind('resize')
    @resetLoadTriggers()

    $('#content').fadeOut 'fast', ->
      $('body').scrollTop(0)
      self.faded = true
      self.reveal()
    
    $('#content').load path, ->
      self.loaded = true
      self.startAppContext(path)
      callback.apply() if callback?

  reveal: ->
    return unless @faded and @loaded
    $('#content').fadeIn('fast')

  startHistory: ->
    Backbone.history.start(pushState: true, silent: true)

  startAppContext: (path) ->
    console.log "Starting app context with", path
    @reveal()

    loadingView.hide()
    tooltipView.bindElements('#content')
    Sounds.stopMusic()

    return if path.match '/logout'
    @startForge() if path.match '/forges/'
    @startMap() if path.match '/map'
    if path.match '/enemies'
      @startBattle() 
    else
      @stopBattle()
  
  startForge: ->
    window.forge = new ForgeCraft.Models.Forge(ForgeCraft.Config.forge)
    window.forgeView = new ForgeCraft.Views.ForgeView el: $('#forge').get(0), model: window.forge
    window.forge.events.processLastEvent()

  startMap: ->
    mapView.start()

  startBattle: ->
    window.battle = new ForgeCraft.Models.Battle enemy: ForgeCraft.Config.enemy
    window.battleView = new ForgeCraft.Views.BattleView model: window.battle

  stopBattle: ->
    return unless window.battle?
    window.battle.stop()

  sendToBoss: (boss) ->
    splashView.queueMessage("Forging Complete!")
    splashView.queueMessage("Boss Fight!")
    setTimeout =>
      Backbone.history.navigate("enemies/" + boss.to_param, true)
    , 2500

  bindInternalLinks: ->
    $('a').live 'click', ->
      unless $(@).attr('data-external')
        r = $(@).attr('href').slice(1)
        Backbone.history.navigate(r, true)

        return false

  bindAlerts: ->
    $('.notice').alert()