class ForgeCraft.Views.BattleView extends Backbone.View

  tagName: 'div'
  id: 'battle'

  initialize: ->
    @model.bind "battle:start", @onBattleStart, @
    @model.bind "change:state", @onStateChange, @
    @model.bind "change:winner", @endBattle, @

    @renderBattle()

    unless Modernizr.touch
      $(window).unbind('resize').resize =>
        @renderBattle()

    $(document).unbind('orientationchange').bind 'orientationchange', =>
      @renderBattle()

    @enemyView = new ForgeCraft.Views.EnemyView model: @model.enemy

    Sounds.playBattleMusic()

  renderBattle: ->
    @resizeBattle()
    @bindStart()

  resizeBattle: ->
    @topBarHeight   = $('.topbar').height();
    @htmlHeight     = $('html').height();
    @battleHeight   = (@htmlHeight - @topBarHeight)

    $('#sidebar').css minHeight: @battleHeight 

    @fullWidth       = $('#enemy').width()
    @sidebarWidth    = $('#sidebar').width()

    $('#battle').css width: (@fullWidth - @sidebarWidth - 20), height: @battleHeight

  bindStart: ->
    self = @
    $('.start').click =>
      @model.start()
      return false

  onStateChange: ->
    @continue() if @model.isPlaying()
    @pause() if @model.isPaused()

  onBattleStart: ->
    self = @
    $('#pre-battle').fadeOut =>
      self.gridView = new ForgeCraft.Views.GridView el: $('#grid').get(0), model: @model.grid

  continue: ->

  pause: ->

  endBattle: ->
    if @model.get("winner") == "player"
      splashView.queueMessage("Victory!")
      uri = "/enemies/" + @model.enemy.get("to_param") + ".json"
      $.post uri, {
        "_method": "PUT",
        "winner": @model.get("winner")
      }, (forge) ->
        Backbone.history.navigate("forges/" + forge.id, true)
    else
      splashView.queueMessage("Defeat!")
      window.location.reload()
