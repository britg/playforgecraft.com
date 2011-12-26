class ForgeCraft.Models.Event extends Backbone.Model

  defaults:
    message: ""

  initialize: ->
    @bind "add", @process, @

  process: ->
    @processBattle() if @get("enemy")?

  processBattle: ->
    forge.enemy = new ForgeCraft.Models.Enemy(@get("enemy"))
    forge.enemy.start()


class ForgeCraft.Collections.Events extends Backbone.Collection

  model: ForgeCraft.Models.Event
  url: ->
    "/forges/" + forge.get("id") + "/events"

  lastEvent: ->
    @at @length-1

  processLastEvent: ->
    ev = @lastEvent()
    console.log "Processing event", ev
    ev.process()