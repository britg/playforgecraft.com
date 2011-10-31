@ActiveForgeView = Backbone.View.extend
  
  tagName: 'div'
  className: 'active-forge'
  id: '#active-forge'

  initialize: ->
    self = @
    @bind "ForgeCraft:checkpointActivated", @checkpointActivated, @

    $(window).bind 'keydown', (e) ->
      console.log "Triggering key down!"
      return unless self.active
      return unless e.which == 32 or e.keyCode == 32
      self.checkpointViews[0].activateCheckpoint()
      e.preventDefault()
      return false

  bar: ->
    $('#bar')

  reset: ->
    @bar().remove()
    $(@el).find('#bar-container').html('<div id="bar" />');
    $(@el).find('.checkpoint img').show()
    $(@el).find('.marker').removeClass("activated")

  start: ->
    @active = yes
    @positionCheckpoints()
    $(@el).show()
    # @bar().animate left: 0, 3000, () -> self.finish()
    setTimeout =>
      @activateBar()
    , 500

  activateBar: ->
    $('#bar').removeClass("new").addClass("activated")
    setTimeout => 
      @finish() if @active
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

  checkpointActivated: ->
    console.log "Checkpoint activated"
    @finish()

  stop: ->
    @bar().css left: @bar().css("left")

  finish: ->
    return unless @active
    @active = no
    @stop()
    $(@el).fadeOut =>
      @reset()
      game.trigger "ForgeCraft:activeForgeComplete", 100