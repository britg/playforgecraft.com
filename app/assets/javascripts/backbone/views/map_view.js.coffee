class ForgeCraft.Views.MapView extends Backbone.View

  tagName: 'div'
  className: 'map'
  
  initialize: ->
    self = @
    $('input[name="player[zone_id]"]').change ->
      zone_id = $(@).val()

      loadingView.show()
      $.post '/players/' + player.get("name") + '/zone', {
        _method: "PUT",
        player: {zone_id: zone_id}
      }, self.travel

  travel: (response) ->
    console.log "Travelling!", response
    loadingView.hide()