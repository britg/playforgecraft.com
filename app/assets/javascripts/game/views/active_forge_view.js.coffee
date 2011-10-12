@ActiveForgeView = Backbone.View.extend
  
  tagName: 'div'
  className: 'active-forge'
  id: '#active-forge'

  bar: ->
    $('#bar')

  reset: ->
    @bar().removeClass("activated")
    $(@el).find('.checkpoint img').show()
    $(@el).find('.marker').removeClass("activated")

  start: ->
    self = @
    @positionCheckpoints()
    $(@el).show()
    # @bar().animate left: 0, 3000, () -> self.finish()
    setTimeout =>
      @activateBar()
    , 500

  activateBar: ->
    $('#bar').addClass "activated"
    setTimeout => 
      @finish()
    , 1500

  calculateCheckpoints: ->
    @checkpoints = []
    @checkpoints.push (25 + Math.random()*50)

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