@MenuView = Backbone.View.extend

  tagName: 'a'
  className: 'settings'
  
  events:
    mouseup: "activate"

  activate: ->
    console.log "Activating menu"
    return false