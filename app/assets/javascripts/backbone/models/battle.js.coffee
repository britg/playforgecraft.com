class ForgeCraft.Models.Battle extends Backbone.Model

  defaults:
    mode: "singleplayer"

class ForgeCraft.Collections.Battles extends Backbone.Collection

  model:  ForgeCraft.Models.Battle
  url:    '/battles'