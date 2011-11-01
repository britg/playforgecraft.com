class ForgeCraft.Views.PlayerView extends Backbone.View

  tagName: 'div'

  initialize: ->

    @model.bind "change:coins", @onCoinChange, @

  onCoinChange: ->
    coins = @model.get("coins")
    console.log "Updating coins to", coins
    @updateCoinage(coins)

  updateCoinage: (coins) ->
    $('#player-bar').find('.coins').html(coins)