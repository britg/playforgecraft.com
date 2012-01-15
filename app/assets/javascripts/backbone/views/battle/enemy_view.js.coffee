class ForgeCraft.Views.EnemyView extends Backbone.View

  initialize: ->
    @model.bind "change:defense", @reflectCurrentDefense, @
    @model.bind "damage_taken", @takeDamage, @
    @model.bind "shieldbash_taken", @takeShieldBash, @

  takeDamage: (type, dmg, critical=no) ->
    @lifebarReflectDamage(dmg, critical)
    Sounds.play type

  lifebarReflectDamage: (dmg, critical=no) ->
    $('#enemy-lifebar').effect("pulsate", { times: 3 } , 50)
    if critical
      @showCombatText("Critical Hit! -" + dmg, big=true)
    else
      @showCombatText("-" + dmg)

  takeShieldBash: () ->
    @showCombatText("Shield Bash!")

  showCombatText: (msg, big=no) ->
    id = Math.round(Math.random()*10000)
    $('.enemy').find('.combat-text')
                .append('<span class="damage" id="' + id + '">' + msg + '</span>' )

    $('#' + id).addClass('big') if big
    
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