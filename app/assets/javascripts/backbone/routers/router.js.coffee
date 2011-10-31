class ForgeCraft.Routers.Router extends Backbone.Router
  initialize: (options) ->

  load: (path, callback) ->
    flashView.hide()
    loadingView.show()
    $(window).unbind('resize')
    $('#content').load path, ->
      loadingView.hide()
      callback.apply() if callback?
    
  routes:

    "": "home"

    "login": "login"
    "register": "register"

    "forge": "forge"

    ":player": "player"

  # User

  home: ->
    @load('/')

  login: ->
    @load('/login')

  register: ->
    @load('/register')

  # Player

  player: (player) ->
    @load("/" + player)

  # Forge
        
  forge: ->
    console.log "Triggering"
    @load '/forge', ->
      window.forgeView = new ForgeCraft.Views.ForgeView el: $('#forge').get(0)
