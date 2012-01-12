class ForgeCraft.Models.Enemy extends Backbone.Model

  takeAttack: (type, count) ->
    console.log @get("name"), "taking", count, "x", type
  