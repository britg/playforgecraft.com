class ForgeCraft.Views.MapView extends Backbone.View

  tagName: 'div'
  className: 'map'
  
  initialize: ->

  showMine: ->
    $('#map.details').load

  bindTravelActions: ->
    self = @
    $('.travel').click ->
      mine_id = $(@).attr("data-mine-id")
      self.startTravel(mine_id)
      return false

  startTravel: (mine_id)->
    console.log "Starting travel with mine id", mine_id
    loadingView.show()
    $.post '/players/' + player.get("name") + '/mine', {
      _method: "PUT",
      player: {mine_id: mine_id}
    }, @travel

  travel: (response) ->
    console.log "Travelling!", response
    loadingView.hide()