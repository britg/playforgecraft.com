class ForgeCraft.Views.AppView extends Backbone.View

  initialize: ->

    @startHistory()
    @bindInternalLinks()
    @bindAlerts()

    @bind "ForgeCraft::ViewLoaded", @startAppContext, @
    @startAppContext(window.location.pathname)

  load: (path, callback) ->
    self = @
    flashView.hide()
    loadingView.show()
    @hideAllPopovers()
    $(window).unbind('resize')
    
    $('#content').load path, ->
      loadingView.hide()
      self.trigger "ForgeCraft::ViewLoaded", path
      callback.apply() if callback?

  startHistory: ->
    Backbone.history.start(pushState: true, silent: true)

  startAppContext: (path) ->
    console.log "Starting app context with", path
    enemyView.unbindKeys() if enemyView?
    $('body').scrollTop(0)

    Sounds.stop('forge_bg')

    return if path.match '/logout'
    @startForge() if path.match '/forges/'
    @startBattle() if path.match '/battles/'
    @startMap() if path.match '/map'

    @bindPopovers()
    tooltipView.bindTooltips()

    $('abbr.timeago').timeago()
  
  startForge: ->
    window.forge = new ForgeCraft.Models.Forge(ForgeCraft.Config.forge)
    window.forgeView = new ForgeCraft.Views.ForgeView el: $('#forge').get(0), model: window.forge
    window.forge.events.processLastEvent()
    Sounds.playMusic()

  startBattle: ->
    window.battle = new ForgeCraft.Models.Battle(ForgeCraft.Config.battle)
    window.battleView = new ForgeCraft.Views.BattleView el: $('#battle').get(0), model: window.battle
    window.battle.continue()

  startMap: ->
    mapView.bindTravelActions()
    mapView.refresh()

  bindInternalLinks: ->

    $('a').live 'click', ->
      unless $(@).attr('data-external')
        r = $(@).attr('href').slice(1)
        Backbone.history.navigate(r, true)

        return false

  bindAlerts: ->

    $('.notice').alert()

  bindPopovers: ->
    

  hideAllPopovers: ->
    $('.popover').remove()