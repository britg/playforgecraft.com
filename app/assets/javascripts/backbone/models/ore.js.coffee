class ForgeCraft.Models.Ore extends Backbone.Model
  paramRoot: 'ore'

  defaults:
    rank: 1
    x: -1
    y: -1
    moveable: true
    neighbors: []

  initialize: ->
    @bind "change", @cache, @

  cache: ->
    Ores.cache(@)

  clearForgeable: ->
    @set forgeable: undefined
    @set neighbors: []

  dropTo: (y) ->
    # console.log "Dropping ore to", y
    Ores.consume(@)
    @set y: y

  forLog: ->
    @get("name") + " (" + @get("x") + ", " + @get("y") + ")" + " in forgeable " + @get("forgeable")

  useMovement: ->
    # console.log "Using movement"
    @set moveable: false
    
  
class ForgeCraft.Collections.OresCollection extends Backbone.Collection
  
  model: ForgeCraft.Models.Ore
  url: ->
    '/forges/' + forge.get("id") + '/ores'

  numCols: 0
  numRows: 0

  oreCache: [[]]
  holes: []
  replacements: []
  oresInForgeables: []
  workingForgeables: []

  initialize: ->
    @bind "destroy", @consume, @
    @bind "reset", @flush, @

  flush: ->
    console.log "Flushing Ores..."
    @oreCache = [[]]
    @holes = []
    @replacements = []
    @oresInForgeables = []
    @workingForgeables = []

  initialFill: (count) ->
    @reset()
    @fetch data: {count: count}, success: @onInitialFill

  onInitialFill: (collection, response) ->
    console.log "On initial fill: ", collection
    col = 0
    row = 0
    Ores.forEach (ore) ->
      ore.set x: col, y: row

      col++
      if col >= Ores.numCols
        col = 0
        row++
    
    Ores.trigger("reveal")
    Ores.refresh()

  cache: (ore) ->
    x = ore.get('x')
    y = ore.get('y')
    @oreCache[x] = [] unless @oreCache[x]?
    @oreCache[x][y] = ore

  uncache: (ore) ->
    x = ore.get('x')
    y = ore.get('y')
    @oreCache[x] = [] unless @oreCache[x]?
    @oreCache[x][y] = undefined

  consume: (ore) ->
    @uncache(ore)
    col = ore.get('x')
    @holes.push(col) unless _.include(@holes, col)

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

    Crafty.audio.play("swap")

  swapOresAndValidate: (oreOne, oreTwo) ->

    unless oreOne.get("moveable") and oreTwo.get("moveable")
      oreOne.trigger("ForgeCraft:MoveBlock") unless oreOne.get("moveable")
      oreTwo.trigger("ForgeCraft:MoveBlock") unless oreTwo.get("moveable")
      return

    unless forge.hasEnoughFunds(2)
      forge.trigger "ForgeCraft:NeedMoreCoins"
      return

    @swapOres(oreOne, oreTwo)

    $.post '/forges/' + forge.get("id") + '/ores/swap.json', {}, (response) ->
      console.log "Swap response", response
      
      if response.purchased
        oreOne.useMovement()
        oreTwo.useMovement()
      else
        Ores.swapOres(oreOne, oreTwo)
        forge.trigger "ForgeCraft:NeedMoreCoins"

      Ores.refresh()
      player.set(response.player)


  refresh: ->
    console.log("Refreshing board")
    @clearForgeables()
    @fillHoles()
    @detectForgeables()

  fillHoles: ->
    return unless @holes.length > 0

    for x in @holes
      @applyGravityAt(x, y) for y in [@numRows-2 .. 0]
      @backFillAt(x, y) for y in [@numRows-2 .. 0]
      _.reject @holes, (col) -> col == x

  applyGravityAt: (x, y) ->
    # console.log "Checking ore at", x, ",", y
    return unless ore = @oreAt(x, y)

    # check ore below this one
    blocked = false
    dy = y
    blocked = @blockage(x, ++dy) while !blocked

    ore.dropTo(dy-1) if blocked and (dy-1)!=y

  backFillAt: (x, y) ->
    return if @oreAt(x, y)

    filler = new ForgeCraft.Models.Ore(@replacements.shift())
    @add(filler)
    filler.set x:x, y:y

  blockage: (x, y) ->
    @oreAt(x, y)? or y >= @numRows

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
    # console.log("Creating forgeable with class", classification)
    # debugger;
    forgeable = new ForgeCraft.Models.Forgeable
      ores: ores
      classification: classification.get("name")
      ore: ores[0].get("name")

    Forgings.add forgeable
    @oresInForgeables = _.union @oresInForgeables, ores

  addReplacements: (ores) ->
    @replacements ||= []
    @replacements = _.union @replacements, ores

  unlockAllOres: ->
    ore.set({moveable: true}) for ore in @models
