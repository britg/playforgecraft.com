@ActiveForgeView = Backbone.View.extend
  
  tagName: 'div'
  className: 'active-forge'
  id: '#active-forge'

  bar: ->
    $(@el).find('#bar')

  reset: ->
    @bar().css left: -@bar().width()
    $(@el).find('.checkpoint img').show()
    $(@el).find('.marker').removeClass("activated")

  start: ->
    self = @
    @positionCheckpoints()
    $(@el).show()
    @bar().animate left: 0, 3000, () -> self.finish()

  calculateCheckpoints: ->
    @checkpoints = []
    @checkpoints.push(25)
    @checkpoints.push(50)
    @checkpoints.push(75)

  positionCheckpoints: ->
    @calculateCheckpoints()
    @checkpointViews ||= []

    for i in [0..2]
      @checkpointViews[i] ||= new CheckpointView el: $('#checkpoint-' + i).get(0)
      @checkpointViews[i].setPosition(@checkpoints[i])

  finish: ->
    $(@el).hide()
    @reset()
    game.trigger "ForgeCraft:activeForgeComplete", 100