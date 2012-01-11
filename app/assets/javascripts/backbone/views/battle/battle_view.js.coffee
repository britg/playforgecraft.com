class ForgeCraft.Views.BattleView extends Backbone.View

  tagName: 'div'
  id: 'battle'

  initialize: ->
    @model.bind "battle:start", @onBattleStart, @
    @model.bind "change:state", @onStateChange, @

    @renderBattle()

    unless Modernizr.touch
      $(window).unbind('resize').resize =>
        @renderBattle()

    $(document).unbind('orientationchange').bind 'orientationchange', =>
      @renderBattle()

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
    $('#pre-battle').fadeOut ->
      self.gridView = new ForgeCraft.Views.GridView el: $('#grid').get(0)

  continue: ->

  pause: ->