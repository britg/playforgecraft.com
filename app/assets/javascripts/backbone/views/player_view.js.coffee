class ForgeCraft.Views.PlayerView extends Backbone.View

  tagName: 'div'

  initialize: ->

    @model.bind "change:coins", @onCoinChange, @
    @model.bind "ForgeCraft:NeedMoreCoins", @shakeMoney, @

    @model.bind "change:defense", @reflectDefense, @

    @bindSkillClick()

  onCoinChange: ->
    coins = @model.get("coins")
    console.log "Updating coins to", coins
    @updateCoinage(coins)

  updateCoinage: (coins) ->
    $('#player-bar').find('.coins').html(coins)

  shakeMoney: ->
    $('#player-bar').find('.coins').effect("shake", { times: 3, distance: 10 }, 50)

  createLootDropZones: ->
    # $('#player-bar').droppable({ accept: '.loot', drop: playerView.cashInLoot })

  cashInLoot: (loot_id) ->
    

  reflectDefense: ->
    $('#defense').find('.val').html(@model.get("defense"))
    $('#defense').find('.stat').effect('shake', { times: 3, distance: 10 }, 50)
    
  bindSkillClick: ->
    $('.increase-skill').live 'click', ->
      skill = $(this).attr("data-skill")
      player.increaseSkill(skill)
