@Board = Backbone.Collection.extend
  
  model: Tile

  tileCache: [[]]

  tilesInForgeables: []

  addAndCache: (tile) ->
    @add(tile)
    @cacheTile(tile)
    
  cacheTile: (tile) ->
    x = tile.get("x")
    y = tile.get("y")

    @tileCache[x] ?= []
    @tileCache[x][y] = tile

  removeTile: (tile) ->
    @remove(tile)
    @tileCache[tile.get('x')][tile.get('y')] = undefined

  recacheTile: (tile) ->
    @removeTile(tile)
    @addAndCache(tile)

  syncTiles: (remoteTiles) ->
    self = @
    $.each remoteTiles, (i, remote) ->
      localTile = self.get(remote.id)
      
      if localTile?
        localTile.set(remote)
      else
        tile = new Tile remote
        self.addAndCache(tile)
        boardView.addTile(tile)

    @refresh()

  tileAt: (x, y) ->
    @tileCache[x]?[y]

  tileInForgeable: (tile) ->
    _.include(@tilesInForgeables, tile)

  refresh: ->
    console.log("Refreshing board")
    @clearForgeables()
    @detectForgeables()

  clearForgeables: ->
    @tilesInForgeables = []
    tile.clearForgeable() for tile in @.models
    
  detectForgeables: ->
    for tile in @.models
      @detectForgeable tile unless @tileInForgeable tile
    @

  detectForgeable: (tile) ->
    self = @
    @workingTile = tile

    match = no
    matchingTemplate = 0
    $.each templates.models, (i, template) ->
      match = self.testTemplate template
      matchingTemplate = template if match
      !match

    @createForgeable matchingTemplate, @workingForgeable if match

  createForgeable: (classification, tiles) ->
    console.log("Creating forgeable with class", classification)
    forgeable = new Forgeable
      tiles: tiles
      classification: classification.get("name")
      ore: tiles[0].get("ore")

    forgeables.add forgeable
    @tilesInForgeables = _.union @tilesInForgeables, tiles

  testTemplate: (template) ->
    self = @
    patterns = template.get("patterns")
    templateMatch = no

    $.each patterns, (i, pattern) ->
      templateMatch = self.testPattern pattern
      !templateMatch

    templateMatch

  testPattern: (pattern) ->
    self = @
    patternMatch = yes
    @workingForgeable = [@workingTile]
    # console.log("Starting new pattern loop")
    
    $.each pattern, (i, point) ->
      patternMatch = self.testTileAt point
      # console.log("Is pattern a match so far?", patternMatch)
      patternMatch

    # console.log("Is the overall pattern a match?", patternMatch)
    patternMatch

  testTileAt: (point) ->

    dX = @workingTile.get('x') + point[0]
    dY = @workingTile.get('y') + point[1]

    tileToTest = @tileAt dX, dY

    # console.log("Testing tile", @workingTile, "against", tileToTest);

    return no unless tileToTest?
    return no if @tileInForgeable tileToTest
    return no unless tileToTest.get("ore") == @workingTile.get("ore")

    @workingForgeable.push(tileToTest)
    # @workingTile.hasNeighbor point
    # tileToTest.isNeighbor point
    # console.log("Tile is a match! Adding to working forgeable", @workingForgeable)

    yes
  
  ###
    Tile Swapping
  ###

  swapTiles: (tileOne, tileTwo) ->
    console.log("Swapping tile models", tileOne, tileTwo);
    
    tileOneX = tileOne.get('x')
    tileOneY = tileOne.get('y')
    tileTwoX = tileTwo.get('x')
    tileTwoY = tileTwo.get('y')

    tileOne.set x: tileTwoX, y: tileTwoY
    tileTwo.set x: tileOneX, y: tileOneY

    game.trigger "ForgeCraft:actionTilesSwapped", tileOne, tileTwo
    @refresh()
