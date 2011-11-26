class ForgeCraft.Views.BattleStubView extends Backbone.View

  tagName: 'div'
  className: 'battle-stub'

  initialize: ->
    $(@el).find('.forfeit-link').bind 'ajax:complete', @onForfeitComplete

  onForfeitComplete: ->
    console.log("Forfeit complete!")
    appView.load "/battles"

  