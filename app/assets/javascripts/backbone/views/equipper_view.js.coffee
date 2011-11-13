class ForgeCraft.Views.EquipperView extends Backbone.View

  initialize: ->
    @bindLootClicks()
    @bindSellClicks()
    @bindEquipClicks()

  bindLootClicks: ->
    self = @
    $('.launch-equipper').live 'click', ->
      id = $(@).attr("data-id")
      self.activateEquipper(id)
      return false

  bindSellClicks: ->
    self = @
    $('.loot').find('.sell-action').live 'click', (e) ->
      loot_id = $(this).parent().attr("data-id")
      loot = Loot.get(loot_id)
      loot.sell()

      $(document).trigger("close.facebox")
      e.preventDefault()
      return false

  bindEquipClicks: ->
    self = @
    $('.slot.enabled').live 'click', (e) ->
      loot_id = $('#equipper').find('.loot').attr("data-id")
      slot = $(this).attr('rel')
      hero_id = $(this).attr("data-hero-id")
      player.equip(hero_id, slot, loot_id)
      return false

  activateEquipper: (loot_id) ->
    $.facebox ajax: "/loot/" + loot_id