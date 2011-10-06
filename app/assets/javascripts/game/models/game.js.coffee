
@Game = Backbone.Model.extend

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
