class ForgeCraft.Views.LoadingView extends Backbone.View

  tagName: 'div'
  id: 'loading'

  show: ->
    $(@el).fadeIn()

  hide: ->
    $(@el).fadeOut()