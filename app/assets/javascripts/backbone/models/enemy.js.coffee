class ForgeCraft.Models.Enemy extends Backbone.Model

  initialize: ->
    console.log "Initializing enemy!", @

  start: ->
    forgeView.startFight()

  win: ->
    params =
      _method: "put"
      winner: "enemy"

    $.post "/forges/" + forge.get("id") + "/enemies/" + @get("id"), params, (response) ->
      forge.processEventResponse(response)
      forgeView.endFight()

    return false


class ForgeCraft.Collections.Enemies extends Backbone.Collection

  model: ForgeCraft.Models.Enemy
  url: ->
    "/forges/" + forge.get("id") + "/enemies"