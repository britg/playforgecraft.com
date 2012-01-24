class ForgeCraft.Models.Event extends Backbone.Model

  defaults:
    message: ""

  initialize: ->
    @bind "add", @process, @

  process: ->
    @processBoss() if @get("boss")?

  processBoss: ->
    setTimeout =>
      #window.appView.sendToBoss(@get("boss"))
      forgeView.enableBossFight(@get("boss"))
    , 1000

class ForgeCraft.Collections.Events extends Backbone.Collection

  model: ForgeCraft.Models.Event
  url: ->
    "/forges/" + forge.get("id") + "/events"

  lastEvent: ->
    @at @length-1

  processLastEvent: ->
    ev = @lastEvent()
    return unless ev?
    console.log "Processing event", ev
    ev.process()