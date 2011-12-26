class ForgeCraft.Views.TargetView extends Backbone.View

  initialize: (lane) ->
    @lane = lane

  createNewTarget: ->
    $('.target.' + @lane).clone()

  attack: ->
    t = @createNewTarget()

    $('.lane.' + @lane).append(t)

    $(t).fadeIn =>
      $(t).css left: "97%"

      setTimeout =>
        $(t).remove()
      , 5000

  takeDamage: (damage) ->
    $('.lane.' + @lane).find('.target:visible').remove()