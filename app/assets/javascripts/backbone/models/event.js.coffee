class ForgeCraft.Models.Event extends Backbone.Model

  defaults:
    message: ""

  initialize: ->
    @bind "add", @process, @

  process: ->
    @processBattle() if @get("battle")?

  processBattle: ->
    console.log "Processing battle!", @get("enemy")


class ForgeCraft.Collections.Events extends Backbone.Collection

  model: ForgeCraft.Models.Event
  url: ->
    "/forges/" + forge.get("id") + "/events"

  lastEvent: ->
    @at @length-1