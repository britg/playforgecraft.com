
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

  remoteSwap: (tileOne, tileTwo) ->
    console.log "Generating action to swap tiles"

    action = new Action 
      gameId: @get("id")
      action: "swap_tiles"
      tiles: [tileOne, tileTwo]

    action.save()

  forge: (forgeable) ->

    tiles = forgeable.get("tiles")

    @remoteForge(tiles)
    
    $.each tiles, (i, tile) ->
      tile.consume()

  remoteForge: (tiles) ->
    action = new Action
      gameId: @get("id")
      action: "forge"
      tiles: tiles

    action.save()