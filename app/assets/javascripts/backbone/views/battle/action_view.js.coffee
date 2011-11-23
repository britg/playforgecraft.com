class ForgeCraft.Views.ActionView extends Backbone.View

  tagName: 'li'
  className: 'log-action'

  template: ->
    $('#log-templates').find("." + @model.get("type"))

  render: ->
    console.log "Rendering log action of type", @model.get("type")
  
    if @model.get("type") == 'message'
      @buildMessage()

    if @model.get("type") == 'attack'
      @buildAttack()

    $(@el).hide()
    $('.action-list').prepend($(@el))
    $(@el).fadeIn()

  buildMessage: ->

    $(@el).html @template().clone()
    $(@el).find('.actor').html @model.get("player_name")
    $(@el).find('.content').html @model.get("message")

  buildAttack: ->
    console.log "Building attack", @model
    $(@el).html @template().clone()
    $(@el).find('.player').html(@model.get("player").name)
    $(@el).find('.hero').html(@model.get("hero").name).addClass(@model.get("hero").job_name)
    $(@el).find('.target').html(@model.get("target").name).addClass(@model.get("target").job_name)
    $(@el).find('.damage').html(@model.get("damage_dealt"))
