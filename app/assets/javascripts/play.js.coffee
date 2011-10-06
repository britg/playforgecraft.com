#= require jquery
#= require lib/underscore
#= require lib/json2
#= require lib/backbone
#= require_tree ./game/models
#= require_tree ./game/collections
#= require_tree ./game/views

@game = new Game
@templates = new ClassTemplates([@sword])
@forgeables = new ForgeableCollection

$ ->

  game.board = new Board
  game.initTiles()

  game.board.detectForgeables().highlightForgeables()

  console.log("Forgeables: ", forgeables)