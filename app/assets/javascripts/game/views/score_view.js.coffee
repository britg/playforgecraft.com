@ScoreView = Backbone.View.extend

  tagName: 'table'
  className: 'scores'

  initialize: ->
    console.log @model
    @model.bind "change:challenger_turns_remaining", @updateTurnsRemaining, @

  updateTurnsRemaining: ->
    console.log "Updating turns remaining"
    $(@el).find('.turns.value').html(@model.get("challenger_turns_remaining"))