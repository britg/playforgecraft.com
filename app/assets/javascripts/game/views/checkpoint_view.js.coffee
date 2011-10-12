@CheckpointView = Backbone.View.extend
  
  tagName: 'div'
  className: 'checkpoint'

  events:
    "mousedown a": "activateCheckpoint"

  setPosition: (pos) ->
    $(@el).css left: pos + "%"

  activateCheckpoint: ->
    $(@el).find('.marker').addClass("activated")
    $(@el).find('img').fadeOut("fast")
    game.activeForgeView.trigger "ForgeCraft:checkpointActivated"
    return false