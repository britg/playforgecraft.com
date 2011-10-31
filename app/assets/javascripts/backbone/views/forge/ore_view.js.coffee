class ForgeCraft.Views.OreView extends Backbone.View

  tagName: 'div'

  className: 'ore'

  initialize: () ->
    @model.bind "change:forgeable", @updateHighlight, @
    @model.bind "change:x", @updateCoordinates, @
    @model.bind "change:y", @updateCoordinates, @
    @model.bind "change:neighbors", @updateNeighbors, @
    @model.bind "destroy", @consume, @

  render: ->
    @el = $('<div class="ore" />').get(0);
    $(@el).addClass(@model.get('to_class'))
    $(@el).data view: @
    $(@el).css("backgroundImage", "url(" + @oreUrl() + ")")
    @

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
    boardTop = forgeView.topOffset
    topPos = boardTop + ForgeCraft.Config.oreDim * @model.get("y")

  updateCoordinates: () ->
    $(@el).attr("data-x", @model.get('x')).attr("data-y", @model.get('y'))
    $(@el).find('img').attr("data-x", @model.get('x')).attr("data-y", @model.get('y'))

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

  consume: () ->
    $(@el).fadeOut "slow", -> $(@).remove()
    