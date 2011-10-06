#= require jquery
#= require lib/underscore
#= require lib/json2
#= require lib/backbone
#= require_tree ./game/models
#= require_tree ./game/collections
#= require_tree ./game/views

@config =
  numRows: 12
  numCols: 12
  tileWidth: 48
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
    game.board.detectForgeables().highlightForgeables()
  
  setTimeout highlight, config.forgeableTimeout