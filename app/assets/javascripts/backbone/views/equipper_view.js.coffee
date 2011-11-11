class ForgeCraft.Views.EquipperView extends Backbone.View

  initialize: ->
    @bindLootClicks()
    @bindSellClicks()

  bindLootClicks: ->
    self = @
    $('.loot').live 'click', ->
      id = $(@).attr("data-id")
      self.activateEquipper(id)

  bindSellClicks: ->
    self = @
    $('.loot').find('.sell-action').live 'click', (e) ->
      loot_id = $(this).parent().attr("data-id")
      loot = Loot.get(loot_id)
      loot.sell()

      $(document).trigger("close.facebox")
      e.preventDefault()
      return false

  activateEquipper: (loot_id) ->
    $.facebox ajax: "/loot/" + loot_id