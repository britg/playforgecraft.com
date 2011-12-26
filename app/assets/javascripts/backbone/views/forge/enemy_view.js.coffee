class ForgeCraft.Views.EnemyView extends Backbone.View

  tagName: 'div'
  id: 'battle'

  initialize: ->
    console.log "Initializing enemy view for ", @model.get("name")