@MenuView = Backbone.View.extend

  tagName: 'a'
  className: 'settings'
  
  events:
    mouseup: "activate"

  activate: (e) ->
    console.log "Activating menu"
    $.facebox div: '#menu'