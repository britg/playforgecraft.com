
@Game = Backbone.Model.extend

  initialize: ->
    @bind "ForgeCraft:actionTilesSwapped", @actionTilesSwapped

  initTiles: ->
    game = @

    $('.tile').each ->
      
      tile = new Tile 
        id: $(@).attr("data-remote-id")
        x: parseInt($(@).attr("data-x"))
        y: parseInt($(@).attr("data-y"))
        ore: $(@).attr("data-ore")

      game.board.addAndCache(tile)
      
      tileView = new TileView 
        model: tile
        id: $(@).attr("id")
        el: @

  actionTilesSwapped: (tileOne, tileTwo) ->
    console.log "Generating action to swap tiles"

    action = new Action 
      gameId: @get("id")
      action: "swap_tiles"
      tiles: [tileOne, tileTwo]

    action.save()