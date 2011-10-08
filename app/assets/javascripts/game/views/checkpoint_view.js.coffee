@CheckpointView = Backbone.View.extend
  
  tagName: 'div'
  className: 'checkpoint'

  events:
    "mousedown a": "activateCheckpoint"

  setPosition: (pos) ->
    $(@el).css left: pos + "%"

  activateCheckpoint: ->
    console.log "Activating checkpoint!"
    $(@el).find('.marker').addClass("activated")
    $(@el).find('img').fadeOut("fast")
    return false