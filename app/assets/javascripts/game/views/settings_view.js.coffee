@SettingsView = Backbone.View.extend

  tagName: 'div'
  className: 'settings-menu'
  
  events:
    "mousedown a": "menuItemClicked"

  menuItemClicked: (e) ->
    