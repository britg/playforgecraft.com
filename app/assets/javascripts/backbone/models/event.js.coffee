class ForgeCraft.Models.Event extends Backbone.Model

  defaults:
    message: ""

class ForgeCraft.Collections.Events extends Backbone.Collection

  model: ForgeCraft.Models.Event
  url: ->
    "/forges/" + forge.get("id") + "/events"

  lastEvent: ->
    @at @length-1