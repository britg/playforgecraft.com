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
    for y in [0..11]
      for x in [0..11]
        @detectForgeable @tileAt(x, y)
    @

  detectForgeable: (tile) ->
    return if @tileInForgeable tile

    self = @
    @workingTile = tile

    # console.log("detecting forgeable for tile", tile.forLog())

    match = no
    matchingTemplate = 0

    for i in [0..templates.length-1]
      template = templates.at(i)
      # console.log "attempting to detect", template.get("name")
      match = self.testTemplate template
      matchingTemplate = template if match
      @createForgeable matchingTemplate, @workingForgeable if match
      !match

    

  testTemplate: (template) ->
    self = @
    patterns = template.get("patterns")
    templateMatch = no

    $.each patterns, (i, pattern) ->
      # console.log "Testing", template.get("name"), "pattern", i
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

  createForgeable: (classification, tiles) ->
    # console.log("Creating forgeable with class", classification)
    # debugger;
    forgeable = new Forgeable
      tiles: tiles
      classification: classification.get("name")
      ore: tiles[0].get("ore")

    forgeables.add forgeable
    @tilesInForgeables = _.union @tilesInForgeables, tiles
  
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
