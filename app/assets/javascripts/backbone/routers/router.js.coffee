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
    "armory": "armory"
    "battles": "battles"

    "loot/:id": "loot"

    ":player": "player"

  # User

  home: ->
    menuView.selectNav('profile')
    @load('/')

  login: ->
    @load('/login')

  register: ->
    @load('/register')

  # Player

  player: (player) ->
    menuView.selectNav('profile')
    @load("/" + player)

  # Forge
        
  forge: ->
    console.log "Triggering"
    menuView.selectNav('forge')
    @load '/forge', ->
      window.forgeView = new ForgeCraft.Views.ForgeView el: $('#forge').get(0)

  # Armory

  armory: ->
    menuView.selectNav('armory')
    @load '/armory'

  # Battle

  battles: ->
    menuView.selectNav('battle')
    @load '/battles'