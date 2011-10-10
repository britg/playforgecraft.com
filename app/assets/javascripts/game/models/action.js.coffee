@Action = Backbone.Model.extend

  defaults:
    action: "swap_tiles"

  url: ->
    "/games/" + @get("gameId") + "/actions"

  toJSON: ->
    game_action:
      action: @get("action")
      tile_ids: _.map(@get("tiles"), (tile) -> tile.get("id"))
      forgeable_class: @get("forgeable_class")
      forgeable_ore: @get("forgeable_ore")
      forgeable_accuracy: @get("forgeable_accuracy")