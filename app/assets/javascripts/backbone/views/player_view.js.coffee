class ForgeCraft.Views.PlayerView extends Backbone.View

  tagName: 'div'

  initialize: ->

    @model.bind "change:coins", @onCoinChange, @
    @model.bind "ForgeCraft:NeedMoreCoins", @shakeMoney, @

  onCoinChange: ->
    coins = @model.get("coins")
    console.log "Updating coins to", coins
    @updateCoinage(coins)

  updateCoinage: (coins) ->
    $('#player-bar').find('.coins').html(coins)

  shakeMoney: ->
    $('#player-bar').find('.coins').effect("shake", { times: 3, distance: 10 }, 50)