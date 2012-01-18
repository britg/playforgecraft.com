class ForgeCraft.Views.PlayerView extends Backbone.View

  tagName: 'div'

  initialize: ->
    @model.bind "change:defense", @reflectDefense, @
    @model.bind "change:skills", @reflectSkills, @
    @bindSkillClick()

  reflectDefense: ->
    $('#defense').find('.val').html(@model.get("defense"))
    $('#defense').find('.stat').effect('shake', { times: 3, distance: 10 }, 50)

  reflectSkills: ->
    $('.skill.accuracy').find('.value').html(@model.get("skills")["accuracy"])
    $('.skill.craftsmanship').find('.value').html(@model.get("skills")["craftsmanship"])
    $('.skill.perception').find('.value').html(@model.get("skills")["perception"])

    available_points = @model.get("skills")["available_points"]
    $('.unspent').find('.remaining').html(available_points)

    if available_points < 1
      @showSkills()

  showSkillSelector: ->
    $('#skills').fadeOut ->
      $('#skills').load '/skills?type=unspent', ->
        $('#skills').fadeIn()

  showSkills: ->
    $('#skills').fadeOut ->
      $('#skills').load '/skills', ->
        $('#skills').fadeIn()

  bindSkillClick: ->
    $('.increase-skill').live 'click', ->
      skill = $(this).attr("data-skill")
      player.increaseSkill(skill)

      return false