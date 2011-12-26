#= require_self
#= require_tree ./assets
#= require_tree ./templates
#= require_tree ./models
#= require_tree ./views
#= require_tree ./routers

window.ForgeCraft =
  Models: {}
  Collections: {}
  Routers: {}
  Views: {}
  Config: 
    oreDim: 64
    moveThreshold: 12
    dropInTimeout: 500
    highlightTimeout: 1000
    sound:
      music: true
      effects: true
    splash:
      embiggenDelay: 100
      stickDelay: 1000
      queueDelay: 1400

  Audio: {}