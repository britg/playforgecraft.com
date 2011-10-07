@Action = Backbone.Model.extend

  defaults:
    action: "swap_tiles"

  url: ->
    "/games/" + @get("gameId") + "/actions"

  toJSON: ->
    action:
      action: @get("action")
      tiles: @get("tiles")