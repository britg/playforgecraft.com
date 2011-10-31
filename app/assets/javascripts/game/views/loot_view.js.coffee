@LootView = Backbone.View.extend

  tagName: 'div'
  
  className: 'loot'
  
  render: ->
    console.log "Rendering loot with", @model

    $(@el).addClass(@model.get("item_attributes").type)
    $(@el).find('.icon').attr('src', @model.get("item_attributes").icon_url)
    $(@el).find('.name').addClass(@model.get("item_attributes").type)
    $(@el).find('.name').html(@model.get("item_attributes").name)

    if @model.get("attack") > 0
      $(@el).find('.attack').find('.val').html(@model.get("attack"))
    else
      $(@el).find('.attack').remove()

    if @model.get("defense") > 0
      $(@el).find('.defense').find('.val').html(@model.get("defense"))
    else
      $(@el).find('.defense').remove()

  display: ->
    $(@el).hide()
    $('#loot-list').prepend($(@el))
    $(@el).fadeIn()