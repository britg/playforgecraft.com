class ForgeCraft.Views.ArmoryView extends Backbone.View

  initialize: ->
    @bindItemDelete()
    @bindFilterChange()

    @bindItemCreateLink()
    @bindItemEditLink()

    @bindItemFormCallbacks()

    @bindItemSold()

  bindItemDelete: ->
    $('.delete-item').live "ajax:complete", (e) ->
      item_id = $(e.target).attr("data-item-id")
      $('#row_item_' + item_id).remove()

  bindFilterChange: ->
    $('input[rel=filter]').live 'change', @applyFilter

  applyFilter: ->

    uri = 'armory?'

    # Classification
    classification = $('input[name=classification]:checked').val()
    uri += '&classification=' + classification

    # Level
    levelRange = $('input[name=level_range]:checked').val()
    uri += '&level_range=' + levelRange

    # Ore
    ores = []
    ores_uri = ''
    $('input[name="ores[]"]:checked').each (i, input) ->
      id = $(input).val()
      ores.push(id)
      ores_uri += '&ores[]=' + id

    unless ores.length == $('input[name="ores[]"]').length or ores.length == 0
      uri += ores_uri

    # Rarity
    rarities = []
    rarities_uri = ''
    $('input[name="rarities[]"]:checked').each (i, input) ->
      id = $(input).val()
      rarities.push(id)
      rarities_uri += '&rarities[]=' + id

    unless rarities.length == $('input[name="rarities[]"]').length or rarities.length == 0
      uri += rarities_uri

    Backbone.history.navigate(uri, false) 

    uri = '/' + uri + '&filter=1'
    loadingView.show()
    $('#item-table-wrap').load uri, ->
      loadingView.hide()

  bindItemCreateLink: ->
    $('.create-item').live 'click', ->
      $.facebox ajax: "/items/new"

      return false

    

  bindItemEditLink: ->
    $('.edit-item').live 'click', ->
      item_id = $(this).attr("rel")
      $.facebox ajax: "/items/" + item_id + "/edit"

      return false

  bindItemFormCallbacks: ->

    $('#new_item, .edit_item').live 'ajax:beforeSend', ->
      loadingView.show()

    $('#new_item, .edit_item').live 'ajax:complete', ->
      loadingView.hide()
      $(document).trigger 'close.facebox'
      window.armoryView.applyFilter()

  bindItemSold: ->
    window.Loot.bind "destroy", @removeItem, @

  removeItem: (model) ->
    $('.loot[data-id=' + model.get("id") + ']').fadeOut ->
      $(this).remove()