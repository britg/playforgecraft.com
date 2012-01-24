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

    "colosseum": "colosseum"
    "enemies/:id": "enemy"

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
    if $('#map').length > 0
      mapView.selectMine(ident)
    else
      @load('/map/' + ident)

  # Ladder

  ladder: ->
    menuView.selectNav('ladder')
    @load("/ladder")

  # Battle

  colosseum: ->
    menuView.selectNav('colosseum')
    @load("/colosseum")

  enemy: (id) ->
    menuView.selectNav('colosseum')
    @load("/enemies/" + id)

  # Logout

  logout: ->
    @load "/logout", ->
      $(document).trigger("close.facebox")
      Backbone.history.navigate("/")