class ForgeCraft.Views.EquipperView extends Backbone.View

  initialize: ->
    @bindLootClicks()

  bindLootClicks: ->
    self = @
    $('.loot').live 'click', ->
      id = $(@).attr("data-id")
      self.activateEquipper(id)

  activateEquipper: (loot_id) ->
    $.facebox ajax: "/loot/" + loot_id