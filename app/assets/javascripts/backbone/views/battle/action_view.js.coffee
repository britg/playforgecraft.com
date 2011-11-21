class ForgeCraft.Views.ActionView extends Backbone.View

  tagName: 'li'
  className: 'log-action'

  template: ->
    $('#log-templates').find("." + @model.get("type"))

  render: ->
    console.log "Rendering log action of type", @model.get("type")
  
    if @model.get("type") == 'message'
      @buildMessage()

    $('.action-list').prepend($(@el))

  buildMessage: ->

    $(@el).html @template().clone()
    $(@el).find('.actor').html @model.get("player_name")
    $(@el).find('.content').html @model.get("message")
