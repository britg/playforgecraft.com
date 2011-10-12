
@Game = Backbone.Model.extend

  initialize: ->
    @bind "ForgeCraft:actionTilesSwapped", @remoteSwap
    @bind "ForgeCraft:activeForgeComplete", @forgeWithAccuracy

  start: ->
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

      $(@).data view: tileView

    setTimeout =>
      boardView.reveal()
    , 500

    setTimeout =>
      scoreView.reveal()
    , 1000

    setTimeout game.revealLootList, 1500

    setTimeout =>
      game.board.refresh()
    , 2000

  revealLootList: ->
    $('#loot-list').fadeIn();

  remoteSwap: (tileOne, tileTwo) ->
    console.log "Generating action to swap tiles"

    action = new Action 
      gameId: @get("id")
      action: "swap_tiles"
      tiles: [tileOne, tileTwo]

    action.save action.toJSON, success: @syncScore

  forge: (forgeable) ->
    console.log "forging", forgeable
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
      forgeable_accuracy: accuracy
      forgeable_class: forgeable.get("classification")
      forgeable_ore: forgeable.get("ore")

    action.save action.toJSON, success: @syncBoard

  syncScore: (model, response) ->
    console.log "Syncing score"
    game.set response.payload.game

  syncBoard: (model, response) ->
    console.log("Sync board", response)
    game.set response.payload.game
    game.board.syncTiles(response.payload.tiles)
    game.createLoot(response.payload.loot)

  createLoot: (att) ->
    loot = new Loot(att)
    lootView = new LootView id: loot.id, model: loot, el: $('#loot-template').find('.loot').clone().get(0)
    lootView.render()
    lootView.display()
    

  ###
    Active Forge
  ###
  
  activeForge: ->
    @activeForgeView ||= new ActiveForgeView el: $('#active-forge').get(0)
    @activeForgeView.start()