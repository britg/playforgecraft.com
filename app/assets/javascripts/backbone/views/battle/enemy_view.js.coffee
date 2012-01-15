class ForgeCraft.Views.EnemyView extends Backbone.View

  initialize: ->
    @model.bind "change:defense", @reflectCurrentDefense, @
    @model.bind "damage_taken", @takeDamage, @
    @model.bind "shieldbash_taken", @takeShieldBash, @

  takeDamage: (type, dmg) ->
    @lifebarReflectDamage(dmg)
    Sounds.play type

  lifebarReflectDamage: (dmg) ->
    $('#enemy-lifebar').effect("pulsate", { times: 3 } , 50)
    @showCombatText("-" + dmg)

  takeShieldBash: () ->
    @showCombatText("Shield Bash!")

  showCombatText: (msg) ->
    id = Math.round(Math.random()*10000)
    $('.enemy').find('.combat-text')
                .append('<span class="damage" id="' + id + '">' + msg + '</span>' )
    
    setTimeout =>
      @floatCombatText(id)
    , 300

  floatCombatText: (id) ->
    $('#' + id).addClass('displayed')
                .bind(CSS3_TRANSITION_END, ->
                  $(this).fadeOut ->
                    $(this).remove()
                )
    

  reflectCurrentDefense: ->
    $('.enemy').find('.defense').html(@model.get("defense"))
    $('#enemy-lifebar').find('.bar').css width: @model.lifePercent() + "%"