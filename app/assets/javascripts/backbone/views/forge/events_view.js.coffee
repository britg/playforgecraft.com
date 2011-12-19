class ForgeCraft.Views.EventsView extends Backbone.View

  initialize: ->
    @el = $('#event-list').get(0)

  addEventsHTML: (eventsHTML) ->
    $h = $(eventsHTML).hide()
    $(@el).prepend($h)
    $h.fadeIn();