class ForgeCraft.Models.Ore extends Backbone.Model
  paramRoot: 'ore'

  defaults:
    x: 0
    y: 0

  initialize: ->
    @bind "change", @cache, @

  cache: ->
    Ores.cache(@)

  clearForgeable: ->
    @set forgeable: undefined
    @set neighbors: []

  forLog: ->
    @get("name") + " (" + @get("x") + ", " + @get("y") + ")" + " in forgeable " + @get("forgeable")
  
class ForgeCraft.Collections.OresCollection extends Backbone.Collection
  
  model: ForgeCraft.Models.Ore
  url: '/ores'

  numCols: 0
  numRows: 0

  initialize: ->
    @oreCache = [[]]

  cache: (ore) ->
    x = ore.get('x')
    y = ore.get('y')
    @oreCache[x] = [] unless @oreCache[x]?
    @oreCache[x][y] = ore

  oreAt: (x, y) ->
    return undefined unless @oreCache[x]?
    @oreCache[x][y]

  oreInForgeable: (ore) ->
    _.include(@oresInForgeables, ore)

  swapOres: (oreOne, oreTwo) ->
    console.log("Swapping ore models", oreOne, oreTwo);
    
    oreOneX = oreOne.get('x')
    oreOneY = oreOne.get('y')
    oreTwoX = oreTwo.get('x')
    oreTwoY = oreTwo.get('y')

    oreOne.set x: oreTwoX, y: oreTwoY
    oreTwo.set x: oreOneX, y: oreOneY

    @refresh()

  refresh: ->
    console.log("Refreshing board")
    @clearForgeables()
    @detectForgeables()

  clearForgeables: ->
    @oresInForgeables = []
    ore.clearForgeable() for ore in @models
    
  detectForgeables: ->
    window.Forgings = new ForgeCraft.Collections.Forgings
    for y in [0..(@numRows-1)]
      for x in [0..(@numCols-1)]
        # console.log("detecting forgeable for at", x, ",", y)
        @detectForgeable @oreAt(x, y)
    @

  detectForgeable: (ore) ->
    return if @oreInForgeable ore

    self = @
    @workingOre = ore

    # console.log("detecting forgeable for ore", ore.forLog())

    match = no
    matchingTemplate = 0

    for i in [0..ForgeCraft.ClassTemplates.length-1]
      template = ForgeCraft.ClassTemplates.at(i)
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
    @workingForgeable = [@workingOre]
    # console.log("Starting new pattern loop")
    
    $.each pattern, (i, point) ->
      patternMatch = self.testOreAt point
      # console.log("Is pattern a match so far?", patternMatch)
      patternMatch

    # console.log("Is the overall pattern a match?", patternMatch)
    
    patternMatch

  testOreAt: (point) ->
    # console.log("Testing ore at", point)
    dX = @workingOre.get('x') + point[0]
    dY = @workingOre.get('y') + point[1]

    oreToTest = @oreAt dX, dY

    # console.log("Testing ore", @workingOre, "against", oreToTest);

    return no unless oreToTest?
    return no if @oreInForgeable oreToTest
    return no unless oreToTest.get("name") == @workingOre.get("name")

    @workingForgeable.push(oreToTest)
    # @workingOre.hasNeighbor point
    # oreToTest.isNeighbor point
    # console.log("Ore is a match! Adding to working forgeable", @workingForgeable)

    yes

  createForgeable: (classification, ores) ->
    console.log("Creating forgeable with class", classification)
    # debugger;
    forgeable = new ForgeCraft.Models.Forgeable
      ores: ores
      classification: classification.get("name")
      ore: ores[0].get("name")

    Forgings.add forgeable
    @oresInForgeables = _.union @oresInForgeables, ores