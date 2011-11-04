@LootView = Backbone.View.extend

  tagName: 'div'
  
  className: 'loot'

  initialize: ->
    @model.bind "destroy", @destroy, @
  
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

    $(@el).data("view", @)

  display: ->
    $(@el).hide()
    $('#loot-list').prepend($(@el))
    $(@el).fadeIn =>
      $(@el).draggable().touch({
                                  animate: false,
                                  sticky: false,
                                  dragx: true,
                                  dragy: true,
                                  rotate: false,
                                  resort: true,
                                  scale: false
                              })

  destroy: ->
    $(@el).fadeOut =>
      $(this).remove()