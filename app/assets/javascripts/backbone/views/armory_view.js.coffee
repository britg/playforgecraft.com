class ForgeCraft.Views.ArmoryView extends Backbone.View

  initialize: ->
    @bindItemDelete()

  bindItemDelete: ->
    $('.delete-item').live "ajax:complete", (e) ->
      item_id = $(e.target).attr("data-item-id")
      $('#row_item_' + item_id).remove()
    