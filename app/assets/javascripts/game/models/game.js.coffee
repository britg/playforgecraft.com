
@Game = Backbone.Model.extend

  initialize: ->
    @bind "ForgeCraft:actionTilesSwapped", @remoteSwap
    @bind "ForgeCraft:activeForgeComplete", @forgeWithAccuracy

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

    action.save action.toJSON, success: @syncScore

  forge: (forgeable) ->
    @forgeable = forgeable
    @activeForge()

  forgeWithAccuracy: (accuracy) ->
    @remoteForge(@forgeable, accuracy)
    @consumeForgeable()

  consumeForgeable: ->
    $.each @forgeable.get("tiles"), (i, tile) ->
      tile.consume()

    @forgeable = undefined

  remoteForge: (forgeable, accuracy) ->
    action = new Action
      gameId: @get("id")
      action: "forge"
      tiles: forgeable.get("tiles")
      accuracy: accuracy
      forgeable: forgeable

    action.save action.toJSON, success: @syncBoard

  syncScore: (model, response) ->
    console.log "Syncing score"
    game.set response.payload.game

  syncBoard: (model, response) ->
    console.log("Sync board", response)
    game.set response.payload.game
    game.board.syncTiles(response.payload.tiles)

  ###
    Active Forge
  ###
  
  activeForge: ->
    activeForgeView = new ActiveForgeView el: $('#active-forge').get(0)
    activeForgeView.start()