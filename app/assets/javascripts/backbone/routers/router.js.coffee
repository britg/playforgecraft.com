class ForgeCraft.Routers.Router extends Backbone.Router
  initialize: (options) ->

  load: (path, callback) ->
    appView.load(path, callback)
    
  routes:

    "": "home"

    "login": "login"
    "register": "register"

    "forges/:ident": "forge"

    "armory": "armory"
    "armory/:class": "class"

    "battles": "battles"
    "battles/:id": "battle"

    "ladder": "ladder"

    "loot/:id": "loot"

    "items/:ident": "item"

    "map" : "map"
    "map/:ident" : "mapShow"

    "logout" : "logout"

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

  forge: (ident) ->
    menuView.selectNav('forge')
    @load '/forges/' + ident

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

  mapShow: (ident) ->
    menuView.selectNav('map')
    @load('/map/' + ident)

  # Ladder

  ladder: ->
    menuView.selectNav('ladder')
    @load("/ladder")

  # Battle

  battles: ->
    menuView.selectNav('battle')
    @load '/battles'

  battle: (id) ->
    menuView.selectNav('battle')
    @load '/battles/' + id

  # Logout

  logout: ->
    @load "/logout", ->
      $(document).trigger("close.facebox")
      Backbone.history.navigate("/")