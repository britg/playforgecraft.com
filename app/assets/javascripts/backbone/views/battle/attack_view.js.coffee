class ForgeCraft.Views.AttackView extends Backbone.View

  tagName: 'div'
  className: 'attack'

  events:
    mousedown:  "onDown"
    touchstart: "onDown"
    mousemove:  "onMove"
    touchmove:  "onMove"
    mouseup:    "onUp"
    touchend:   "onUp"
    mouseout:   "onUp"
    touchcancel:"onUp"

  initialize: ->
    @model.bind "change:x", @updateCoordinates, @
    @model.bind "change:y", @updateCoordinates, @
    @model.bind "change:matched", @matched, @
    @model.bind "remove", @remove, @

  render: (drop) ->
    $(@el).addClass(@model.get("type"))
    $(@el).data "view", @

    if drop
      # @animateToPosition()
    else
      $(@el).css left: @leftPos(), top: @topPos() 

  updateCoordinates: () ->
    @animateToPosition(no)

  animateToPosition: (dropDelay = no) ->
    self = @
    timeout = parseInt(Math.random() * ForgeCraft.Config.dropInTimeout)

    $(@el).animate left: @leftPos(), "fast"
    $(self.el).animate top: self.topPos(), "fast"
    

  leftPos: () ->
    boardLeft = $('#grid').position().left
    boardLeft + ForgeCraft.Config.attackDim * @model.get("x")

  topPos: () ->
    y = @model.get("y")
    if y == -1
      topPos = -2*ForgeCraft.Config.attackDim
    else
      boardTop = $('#grid').position().top
      topPos = boardTop + ForgeCraft.Config.attackDim * @model.get("y")

  onDown: (e) ->
    # console.log "Mouse down on me"
    @watching = yes
    @ref = x: e.pageX, y: e.pageY 
    @refAttack = @model

    e.preventDefault()
    false

  onMove: (e) ->
    return unless @watching
    # console.log "Mouse move"

    @delta = x: e.pageX - @ref.x, y: e.pageY - @ref.y

    console.log('delta is', @delta.x, @delta.y)

    # right
    if @delta.x >= ForgeCraft.Config.moveThreshold and @refAttack.get("x") < battle.grid.COLS-1 
      @direction = 'right'

    # left
    if @delta.x <= -ForgeCraft.Config.moveThreshold and @refAttack.get("x") > 0
      @direction = 'left'
    
    # down
    if @delta.y >= ForgeCraft.Config.moveThreshold and @refAttack.get("y") < battle.grid.ROWS - 1
      @direction = 'down'

    # up
    if @delta.y <= -ForgeCraft.Config.moveThreshold and @refAttack.get("y") > 0
      @direction = 'up'
      
    if @direction?
      battle.grid.attemptMove @refAttack, @direction
      @onUp()

    e.preventDefault()
    false

  onUp: ->
    return unless @watching
    @watching = no
    @ref = undefined
    @refAttack = undefined 
    @direction = undefined

  matched: ->
    if @model.get("matched")
      $(@el).addClass('matched') 
    else
      $(@el).removeClass('matched')

  remove: ->
    $(@el).fadeOut =>
      $(@el).remove()


class ForgeCraft.Views.GridView extends Backbone.View

  tagName: 'div'
  id: 'attacks'

  initialize: ->
    $(@el).show()
    @createAttackViews()

    @model.bind "add", @createAttackView, @

  createAttackViews: ->
    @createAttackView(attack, no) for attack in battle.grid.models

  createAttackView: (attack, drop = yes) ->
    attackView = new ForgeCraft.Views.AttackView model: attack, el: @generateAttackElement()
    attackView.gridView = @
    attackView.render(drop)

  generateAttackElement: ->
    $att = $('<div class="attack"><div class="icon" /></div>')
    el = $att.get(0)
    $('#grid').append el
    el

