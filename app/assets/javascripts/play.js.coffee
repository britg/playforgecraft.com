#= require jquery
#= require jquery_ujs
#= require lib/modernizr-2.0.6
#= require lib/facebox
#= require game/lib/underscore
#= require game/lib/json2
#= require game/lib/touchhandler
#= require game/lib/backbone
#= require_tree ./game/models
#= require_tree ./game/collections
#= require_tree ./game/views

#overrideTouchEvents()

@config =
  numRows: 12
  numCols: 12
  tileWidth: 20
  moveThreshold: 12
  dropInTimeout: 500
  highlightTimeout: 1000


@game = new Game
@templates = new ClassTemplates([@tunic, @leggings, @crossbow, @axe, @shield, @sword])
@forgeables = new ForgeableCollection

$ ->

  config.tileWidth = $('.tile').first().width()

  # Init game from embedded JSON
  game.set(config.initialState)

  # Board and Board View
  game.board = new Board
  
  window.boardView = new BoardView 
    model: game.board
    id: "#tiles"
    el: $('#tiles').get(0)

  game.initTiles()

  # Score View
  scoreView = new ScoreView 
    model: game 
    el: $('.scores').get(0)

  # Menu
  menuView = new MenuView el: $('.settings').get(0)

  # Start
  highlight = ->
    game.board.refresh()
  
  setTimeout highlight, config.highlightTimeout