class ForgeCraft.Views.BattleView extends Backbone.View

  initialize: ->

    @render()

  render: ->

    battleHeight = $(window).height() - $('.topbar').height()
    $('#battle').css height: battleHeight
    $('.battler-wrap').css height: battleHeight
    $('.log').css height: battleHeight
