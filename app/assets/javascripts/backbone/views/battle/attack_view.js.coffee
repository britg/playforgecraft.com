class ForgeCraft.Views.AttackView extends Backbone.View

  tagName: 'div'
  className: 'attack'

  render: ->
    $att = $('<div class="attack"><div class="icon" /></div>')
    $att.addClass(@model.get("type"))
    @el = $att.get(0)
    $(@el).css left: @leftPos(), top: @topPos() 
    $('#grid').append(@el)

  leftPos: () ->
    boardLeft = $('#grid').position().left
    boardLeft + ForgeCraft.Config.attackDim * @model.get("x")

  topPos: () ->
    y = @model.get("y")
    if y == -1
      topPost = -2*ForgeCraft.Config.attackDim
    else
      boardTop = $('#grid').position().top
      topPos = boardTop + ForgeCraft.Config.attackDim * @model.get("y")

class ForgeCraft.Views.GridView extends Backbone.View

  tagName: 'div'
  id: 'attacks'

  initialize: ->
    $(@el).show()
    @createAttackViews()

  createAttackViews: ->
    for attack in battle.grid.models
      attackView = new ForgeCraft.Views.AttackView model: attack
      attackView.render()

  start: ->
