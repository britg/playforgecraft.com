class ForgeCraft.Views.OreView extends Backbone.View

  tagName: 'div'

  className: 'ore'

  initialize: () ->
    @model.bind "change:forgeable", @updateHighlight, @
    @model.bind "change:x", @updateCoordinates, @
    @model.bind "change:y", @updateCoordinates, @
    @model.bind "change:neighbors", @updateNeighbors, @
    @model.bind "destroy", @consume, @
    @model.bind "change:marked", @mark, @
    @model.bind "change:moveable", @updateMoveability, @
    @model.bind "ForgeCraft:MoveBlock", @moveBlocked, @

  render: ->
    @el = $('<div class="ore" />').get(0);
    $(@el).addClass(@model.get('to_class'))
    $(@el).data view: @
    @addSides()
    @

  addSides: ->
    $(@el).append('<div class="side top" />')
      .append('<div class="side right" />')
      .append('<div class="side bottom" />')
      .append('<div class="side left" />')

  oreUrl: ->
    ForgeCraft.Config.ores[@model.get("rank")]

  renderAndPosition: ->
    @render()
    $('#ores').append(@el)
    @jumpToPosition()

  leftPos: () ->
    boardLeft = $('#ores').position().left + forgeView.hMargin
    boardLeft + ForgeCraft.Config.oreDim * @model.get("x")

  topPos: () ->
    y = @model.get("y")
    if y == -1
      topPost = -2*ForgeCraft.Config.oreDim
    else
      boardTop = forgeView.topOffset
      topPos = boardTop + ForgeCraft.Config.oreDim * @model.get("y")

  updateCoordinates: () ->
    @animateToPosition(no)

  jumpToPosition: ->
    $(@el).css left: @leftPos(), top: @topPos()

  animateToPosition: (dropDelay = no) ->
    self = @
    timeout = parseInt(Math.random() * ForgeCraft.Config.dropInTimeout)

    $(@el).animate left: @leftPos(), "fast"

    dropDown = ->
      $(self.el).animate top: self.topPos(), "fast"
    
    if dropDelay
      # console.log("timeout on move")
      setTimeout dropDown, timeout
    else
      dropDown()

  updateHighlight: () ->
    if forgeable = @model.get("forgeable")?
      $(@el).addClass "forgeable"
    else
      $(@el).removeClass "forgeable"

  updateNeighbors: () ->
    n = @model.get("neighbors")
    d = ["top", "right", "bottom", "left"]

    $(@el).removeClass(d.join(" "))
    $(@el).addClass(n.join(" "))

  mark: ->
    if @model.get("marked")
      $(@el).addClass("marked")
    else
      $(@el).removeClass("marked")

  consume: () ->
    $(@el).fadeOut "slow", -> $(@).remove()
    
  updateMoveability: () ->
    console.log "Updating moveability"

    if @model.get("moveable")
      # $(@el).find('.status').removeClass('immoveable')
      $(@el).removeClass('immoveable')
    else
      # $(@el).find('.status').addClass('immoveable')
      $(@el).addClass('immoveable')

  moveBlocked: () ->
    $(@el).effect("shake", { times: 3, distance: 10 }, 50)