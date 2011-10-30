class ForgeCraft.Views.FlashView extends Backbone.View

  tagName: 'div'
  id: 'flash-wrap'

  initialize: ->

  show: ->
    $(@el).fadeIn()

  hide: ->
    $(@el).fadeOut()