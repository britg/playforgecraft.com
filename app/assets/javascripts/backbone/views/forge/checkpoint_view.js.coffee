class ForgeCraft.Views.CheckPointView extends Backbone.View
  
  tagName: 'div'
  className: 'checkpoint'

  events:
    "mousedown a": "activateCheckpoint"
    "touchstart a": "activateCheckpoint"

  setPosition: (pos) ->
    $(@el).css left: pos + "%"

  activateCheckpoint: (e) ->
    activeForgeView.trigger "ForgeCraft:checkpointActivated"
    $(@el).find('.marker').addClass("activated")
    e.preventDefault() if e
    return false