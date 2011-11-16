class ForgeCraft.Views.AppView extends Backbone.View

  initialize: ->

    @startHistory()
    @bindInternalLinks()
    @bindAlerts()

  startHistory: ->

    forging = (window.location.pathname == "/forge")
    Backbone.history.start(pushState: true, silent: !forging)

  bindInternalLinks: ->

    $('a').live 'click', ->
      unless $(@).attr('data-external')
        r = $(@).attr('href').slice(1)
        Backbone.history.navigate(r, true)

        return false

  bindAlerts: ->

    $('.notice').alert()