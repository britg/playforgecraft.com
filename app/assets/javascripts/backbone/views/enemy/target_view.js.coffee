class ForgeCraft.Views.TargetView extends Backbone.View

  initialize: (lane) ->
    @lane = lane

  createNewTarget: ->
    id = Math.round(Math.random()*10000)
    $('.target.' + @lane + ':hidden').clone().attr("id", id)

  attack: ->
    t = @createNewTarget()
    $('.lane.' + @lane).append(t)
    console.log("New target with id", t.attr("id"))
    $actual = $('#' + t.attr("id"))
    

    $actual.fadeIn =>
      $actual.css left: "97%"

      setTimeout =>
        $actual.remove()
      , 4500

  takeDamage: (damage) ->
    $('.lane.' + @lane).find('.target:visible').remove()