class ForgeCraft.Views.EnemyView extends Backbone.View

  initialize: ->
    @model.bind "change:defense", @takeDamage, @

  takeDamage: ->
    $('#enemy-lifebar').effect("shake", { times: 3, distance: 10 }, 50)
    $('.enemy').find('.defense').html(@model.get("defense"))
    $('#enemy-lifebar').find('.bar').css width: @model.lifePercent() + "%"
