class ForgeCraft.Views.ActiveForgeView extends Backbone.View
  
  tagName: 'div'
  className: 'active-forge'
  id: '#active-forge'

  initialize: ->
    self = @
    @bind "ForgeCraft:checkpointActivated", @checkpointActivated, @

  bar: ->
    $('#bar')

  bindKeyDown: ->
    self = @
    $(window).bind 'keydown', @activateCheckpoint
      
  activateCheckpoint: (e) ->
    console.log("Triggering key down")
    return unless activeForgeView.active
    return unless e.which == 32 or e.keyCode == 32
    activeForgeView.checkpointViews[0].activateCheckpoint()
    e.preventDefault()
    return false

  unbindKeyDown: ->
    $(window).unbind 'keydown', @activateCheckpoint

  reset: ->
    @clearTimeouts()
    @bar().remove()
    $(@el).find('#bar-container').html('<div id="bar" />');
    $(@el).find('.checkpoint img').show()
    $(@el).find('.marker').removeClass("activated")

  start: ->
    @active = yes
    @positionCheckpoints()
    $(@el).show()
    @bindKeyDown()
    @activateBarTimeout = setTimeout =>
      @activateBar()
    , 1000

  activateBar: ->
    $('#bar').removeClass("new").addClass("activated")
    @finishTimeout = setTimeout => 
      @finish() if @active
    , 1500

  calculateCheckpoints: ->
    @checkpoints = []
    @checkpoints.push (40 + Math.random()*20)

  positionCheckpoints: ->
    @calculateCheckpoints()
    @checkpointViews ||= []

    for i in [0..@checkpoints.length-1]
      @checkpointViews[i] ||= new ForgeCraft.Views.CheckPointView el: $('#checkpoint-' + i).get(0)
      @checkpointViews[i].setPosition(@checkpoints[i])

  checkpointActivated: ->
    console.log "Checkpoint activated"
    @finish()

  stop: ->
    @clearTimeouts()
    @bar().css left: @bar().css("left")
    @unbindKeyDown()

  clearTimeouts: ->
    clearTimeout(@activateBarTimeout)
    clearTimeout(@finishTimeout)

  finish: ->
    @clearTimeouts()
    return unless @active
    @active = no
    @stop()
    $(@el).fadeOut =>
      @reset()
      @trigger "ForgeCraft:activeForgeComplete", 100