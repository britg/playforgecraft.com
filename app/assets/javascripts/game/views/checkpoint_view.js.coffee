@CheckpointView = Backbone.View.extend
  
  tagName: 'div'
  className: 'checkpoint'

  events:
    "mousedown a": "activateCheckpoint"
    "touchstart a": "activateCheckpoint"

  setPosition: (pos) ->
    $(@el).css left: pos + "%"

  activateCheckpoint: (e) ->
    game.activeForgeView.trigger "ForgeCraft:checkpointActivated"
    $(@el).find('.marker').addClass("activated")
    e.preventDefault() if e
    return false