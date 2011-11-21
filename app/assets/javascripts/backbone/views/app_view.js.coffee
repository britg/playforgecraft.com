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
    $(window).unbind('resize')
    
    $('#content').load path, ->
      loadingView.hide()
      self.trigger "ForgeCraft::ViewLoaded", path
      callback.apply() if callback?

  startHistory: ->
    Backbone.history.start(pushState: true, silent: true)

  startAppContext: (path) ->
    console.log "Starting app context with", path

    @startForge() if path == '/forge'
    @startBattle() if path.match '/battles/'  

    @bindPopovers()
  
  startForge: ->
    window.forgeView = new ForgeCraft.Views.ForgeView el: $('#forge').get(0)

  startBattle: ->
    battle = new ForgeCraft.Models.Battle(ForgeCraft.Config.battle)
    window.battleView = new ForgeCraft.Views.BattleView el: $('#battle').get(0), model: battle

  bindInternalLinks: ->

    $('a').live 'click', ->
      unless $(@).attr('data-external')
        r = $(@).attr('href').slice(1)
        Backbone.history.navigate(r, true)

        return false

  bindAlerts: ->

    $('.notice').alert()

  bindPopovers: ->
    return if Modernizr.touch
    $('.loot-icon').popover({
      html: true
      title: ->
        classes = $(this).attr("data-type")
        title = $(this).attr('data-original-title')
        level = $(this).attr('data-level')
        return '<span class="' + classes + '">' + title + '</span> <span class="level">lvl ' + level + '</span>'
      content: ->
        attack = $(this).attr('data-attack')
        defense = $(this).attr('data-defense')

        out = ""
        if attack? and attack > 0
          out += '<span class="attack">' + attack + '</span>'

        if defense? and defense > 0
          out += '<span class="defense">' + defense + '</span>'

        out

    })