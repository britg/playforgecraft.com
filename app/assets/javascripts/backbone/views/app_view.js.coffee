class ForgeCraft.Views.AppView extends Backbone.View

  initialize: ->

    @startHistory()
    @bindInternalLinks()
    @bindAlerts()

    window.router.bind "ForgeCraft::ViewLoaded", @startAppContext, @
    @startAppContext(window.location.pathname)

  startHistory: ->
    Backbone.history.start(pushState: true, silent: true)

  startAppContext: (path) ->
    console.log "Starting app context with", path
    @startForge() if path == '/forge'
    @startBattle() if path.match '/battles/'  
  
  startForge: ->
    window.forgeView = new ForgeCraft.Views.ForgeView el: $('#forge').get(0)

  startBattle: ->
    window.battleView = new ForgeCraft.Views.BattleView el: $('#battle').get(0)

  bindInternalLinks: ->

    $('a').live 'click', ->
      unless $(@).attr('data-external')
        r = $(@).attr('href').slice(1)
        Backbone.history.navigate(r, true)

        return false

  bindAlerts: ->

    $('.notice').alert()