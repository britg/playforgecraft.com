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

  tileAt: (x, y) ->
    @tileCache[x]?[y]

  tileInForgeable: (tile) ->
    _.include(@tilesInForgeables, tile)
    
  detectForgeables: ->
    @tilesInForgeables = []
    @detectForgeable tile for tile in @.models
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
    forgeable = new Forgeable
      tiles: tiles
      classification: classification.name

    forgeables.add forgeable

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
    # console.log("Tile is a match! Adding to working forgeable", @workingForgeable)

    yes

  highlightForgeables: ->

    forgeables.each (forgeable) ->
      $.each forgeable.get("tiles"), (i, tile) ->
        tile.set
          forgeable: forgeable
  
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

    @cacheTile(tileOne)
    @cacheTile(tileTwo)
