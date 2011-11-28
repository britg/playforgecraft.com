class ForgeCraft.Views.LootView extends Backbone.View

  tagName: 'div'
  
  className: 'loot'

  initialize: ->
    @model.bind "destroy", @destroy, @
  
  render: ->
    # console.log "Rendering loot with", @model

    # Basic properties
    $(@el).addClass(@model.get("item_attributes").type).attr("id", "loot-" + @model.get("id"))
    $(@el).attr("data-id", @model.get('id'))
    $(@el).find('.icon').attr('src', @model.get("item_attributes").icon_url)
    $(@el).find('.name').addClass(@model.get("item_attributes").type)
    $(@el).find('.name').html(@model.get("item_attributes").name)
    $(@el).data("view", @)

    # Level
    level = @model.get("level")
    $(@el).find('.level').find('.val').html(level)

    if player.get("level") < level
      $(@el).find('.level').addClass('toohigh')

    # Stats
    if @model.get("attack") > 0
      $(@el).find('.attack').find('.val').html(@model.get("attack"))
    else
      $(@el).find('.attack').remove()

    if @model.get("defense") > 0
      $(@el).find('.defense').find('.val').html(@model.get("defense"))
    else
      $(@el).find('.defense').remove()

    # Sell action
    if @model.get("equipped?")
      $(@el).find('.equipped-indicator').removeClass('hidden')
      $(@el).find('.sell-action').addClass('hidden')
    else
      $(@el).find('.equipped-indicator').addClass('hidden')
      $(@el).find('.sell-action').removeClass('hidden')

  addToLootList: ->
    $(@el).hide()

    if Loot.length > 0 and Loot.at(1)?
      first_loot_id = Loot.at(1).get("id")
    else
      first_loot_id = 0
    
    this_id = @model.get("id")

    if this_id > first_loot_id
      $('#loot-list').prepend($(@el))
    else
      $('#loot-list').append($(@el))

    $(@el).fadeIn()

    @startBattle(@model.get("battle_id")) if @model.get("battle_required?")
  
  startBattle: (ident) ->
    self = @
    $(@el).effect("shake", { times: 3, distance: 10 }, 50)

    battle = new ForgeCraft.Models.Battle id: ident

    setTimeout ->
      if confirm("(Placeholder) You've been attacked! Defend yourself or flee?")
        forgeView.startBattle(ident)
      else
        alert("(Placeholder) The bandits stole 200g and [Item]!");
        battle.forfeit()
    , 1000

  fleeBattle: ->

      
  makeDraggable: ->
    $(@el).draggable({ revert: 'invalid' })
    $(@el).touch({
      animate: false,
      sticky: false,
      dragx: true,
      dragy: true,
      rotate: false,
      resort: true,
      scale: false
    })

  destroy: ->
    $(@el).find('.sell-action').twipsy('hide')
    $(@el).fadeOut =>
      $(@el).remove()