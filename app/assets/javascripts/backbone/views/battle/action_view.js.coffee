class ForgeCraft.Views.ActionView extends Backbone.View

  tagName: 'li'
  className: 'log-action'

  template: ->
    $('#log-templates').find("." + @model.get("type"))

  render: ->
    console.log "Rendering log action of type", @model.get("type")

    $(@el).html @template().clone()
  
    if @model.get("type") == 'message'
      @buildMessage()

    if @model.get("type") == 'attack'
      @buildAttack()

    if @model.get("type") == 'notification'
      @buildNotification()

    $(@el).hide()
    $('.action-list').prepend($(@el))
    $(@el).fadeIn()

  playerName: ->
    @model.get("player").name

  heroName: ->
    @model.get("hero").name

  heroJobName: ->
    @model.get("hero").job_name

  targettedName: ->
    @model.get("targetted").name

  targettedJobName: ->
    @model.get("targetted").job_name

  damageDealt: ->
    @model.get("damage_dealt")

  
  buildMessage: ->
    $(@el).find('.actor').html @model.get("player_name")
    $(@el).find('.content').html @model.get("message")

  buildAttack: ->
    console.log "Building attack", @model
    $(@el).find('.player').html @playerName()
    $(@el).find('.hero').html(@heroName()).addClass(@heroJobName())
    $(@el).find('.target').html(@targettedName()).addClass(@targettedJobName())
    $(@el).find('.damage').html(@damageDealt())

  buildNotification: ->
    $(@el).find('.content').html @model.get("message")