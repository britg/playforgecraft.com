@Action = Backbone.Model.extend

  defaults:
    action: "swap_tiles"

  url: ->
    "/games/" + @get("gameId") + "/actions"

  toJSON: ->
    game_action:
      action: @get("action")
      tile_ids: _.map(@get("tiles"), (tile) -> tile.get("id"))
      forgeable: @get("forgeable")
      accuracy: @get("accuracy")