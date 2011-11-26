class ForgeCraft.Routers.Router extends Backbone.Router
  initialize: (options) ->

  load: (path, callback) ->
    appView.load(path, callback)
    
  routes:

    "": "home"

    "login": "login"
    "register": "register"

    "forge": "forge"

    "armory": "armory"
    "armory/:class": "class"

    "battles": "battles"
    "battles/:id": "battle"

    "loot/:id": "loot"

    "items/:ident": "item"

    "map" : "map"

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
    @load '/forge'

  # Armory

  armory: ->
    menuView.selectNav('armory')
    @load('/armory')

  class: (classification)->
    menuView.selectNav('armory')
    @load('/armory/' + classification)

  item: (ident) ->
    menuView.selectNav('armory')
    @load('/items/' + ident)

  map: ->
    menuView.selectNav('map')
    @load('/map')

  # Battle

  battles: ->
    menuView.selectNav('battle')
    @load '/battles'

  battle: (id) ->
    menuView.selectNav('battle')
    @load '/battles/' + id