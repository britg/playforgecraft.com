class ForgeCraft.Views.MapView extends Backbone.View

  tagName: 'div'
  className: 'map'
  
  initialize: ->
    @bindForgeStubClicks()

  showMine: ->
    $('#map.details').load

  bindTravelActions: ->
    self = @
    $('.travel').click ->
      mine_id = $(@).attr("data-mine-id")
      self.changeMine(mine_id)
      return false

  changeMine: (mine_id)->
    console.log "Starting travel with mine id", mine_id
    loadingView.show()
    $.post '/players/' + player.get("name") + '/mine', {
      _method: "PUT",
      player: {mine_id: mine_id}
    }, @onMineChange

  onMineChange: (response) ->
    console.log "Travelling!", response
    loadingView.hide()
    forge_id = response.forge.id
    mapView.travelTo forge_id

  travelTo: (forge_id) ->
    Backbone.history.navigate("forges/" + forge_id, true)

  bindForgeStubClicks: ->
    $('.forge-stub').live 'click', ->
      mine_id = $(this).attr("data-mine-id")
      mapView.changeMine mine_id