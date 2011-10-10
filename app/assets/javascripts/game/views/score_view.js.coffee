@ScoreView = Backbone.View.extend

  tagName: 'table'
  className: 'scores'

  initialize: ->
    console.log @model
    @model.bind "change:challenger_turns_remaining", @updateTurnsRemaining, @
    @model.bind "change:challenger_attack_score", @updateAttackScore, @
    @model.bind "change:challenger_defense_score", @updateDefenseScore, @

  updateTurnsRemaining: ->
    $(@el).find('.turns.value').html(@model.get("challenger_turns_remaining"))

  updateAttackScore: ->
    $(@el).find('.attack.value').html(@model.get("challenger_attack_score"))
  
  updateDefenseScore: ->
    $(@el).find('.defense.value').html(@model.get("challenger_defense_score"))