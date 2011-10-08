#= require jquery
#= require jquery_ujs
#= require game/lib/underscore
#= require game/lib/json2
#= require game/lib/touchhandler
#= require game/lib/backbone
#= require_tree ./game/models
#= require_tree ./game/collections
#= require_tree ./game/views

overrideTouchEvents()

@config =
  numRows: 12
  numCols: 12
  tileWidth: 60
  moveThreshold: 12
  dropInTimeout: 500
  highlightTimeout: 1000


@game = new Game
@templates = new ClassTemplates([@sword])
@forgeables = new ForgeableCollection

$ ->

  game.board = new Board

  window.boardView = new BoardView 
    model: game.board
    id: "#tiles"
    el: $('#tiles').get(0)

  game.initTiles()

  highlight = ->
    game.board.refresh()
  
  setTimeout highlight, config.highlightTimeout