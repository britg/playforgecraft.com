class ForgeCraft.Views.LaneView extends Backbone.View

  initialize: (lane) ->
    @speeds = ["fast", "slow"]
    @lane = lane

  createNewTarget: ->
    id = Math.round(Math.random()*10000)
    $('.target.' + @lane + ':hidden').clone().attr("id", id)

  attack: ->
    t = @createNewTarget()
    $('.lane.' + @lane).append(t)
    # console.log("New target with id", t.attr("id"))

    $actual = $('#' + t.attr("id"))
    $actual.addClass(@chooseSpeed())
    $actual.fadeIn =>
      $actual.css left: "97%"
      $actual.bind 'webkitTransitionEnd', =>
        @targetAttacked($actual.attr("id"))

  chooseSpeed: ->
    @speeds[Math.floor(Math.random()*2)]

  targetAttacked: (id) ->
    console.log "Target made it through! Do damage"
    forge.enemy.hit(@model)
    @destroyTarget(id)

  targetKilled: (id) ->
    @destroyTarget(id)

  destroyTarget: (id) ->
    t = $('#' + id)
    return unless t?
    t.css left: t.css("left")
    t.fadeOut ->
      t.remove()
