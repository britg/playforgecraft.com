class ForgeCraft.Views.ActiveForgeView extends Backbone.View
  
  tagName: 'div'
  className: 'active-forge'
  id: '#active-forge'

  initialize: ->
    self = @
    @bind "ForgeCraft:checkpointActivated", @checkpointActivated, @
    @reset()

  shouldTrigger: ->
    Math.floor(Math.random()*6) == 1

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
    $(@el).find('.message').css({fontSize:"100%"}).hide()

  start: ->
    @active = yes
    @positionCheckpoints()
    $(@el).show()
    @bindKeyDown()
    @activateBarTimeout = setTimeout =>
      @activateBar()
    , 1000

  accuracy: ->
    markerPos = $(@el).find('.marker').offset().left
    barPos = @bar().offset().left + @bar().width()

    console.log "marker position: ", markerPos, "bar position:", barPos

    return (100 - Math.abs(markerPos - barPos))

  activateBar: ->
    @bar().removeClass("new").addClass("activated")
    @bar().bind CSS3_TRANSITION_END, =>
      @finish() if @active

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
    accuracy = @accuracy()
    @active = no
    @stop()

    setTimeout =>
      $(@el).fadeOut =>
        @reset()
        @trigger "ForgeCraft:activeForgeComplete", accuracy
    , 500

    if accuracy >= ForgeCraft.Config.perfect_accuracy
      splashView.queueMessage("Perfect!")

    if accuracy >= ForgeCraft.Config.unlock_accuracy
      Ores.unlockAllOres()
      splashView.queueMessage("Ores Unlocked!")

    