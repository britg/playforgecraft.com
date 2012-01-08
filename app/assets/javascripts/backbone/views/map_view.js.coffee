class ForgeCraft.Views.MapView extends Backbone.View

  tagName: 'div'
  className: 'map'
  
  initialize: ->

  start: ->
    @bindTravelActions()
    @refresh()

  refresh: ->
    @topBarHeight   = $('.topbar').height();
    @htmlHeight     = $('html').height();
    $('.sidebar').css minHeight: @htmlHeight - @topBarHeight
    $('#map').find('.map').css minHeight: @htmlHeight - @topBarHeight

  showMine: ->
    # $('#map.details').load

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
    forge_id = response.id
    mapView.travelTo forge_id

  travelTo: (forge_id) ->
    Backbone.history.navigate("forges/" + forge_id, true)