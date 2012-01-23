class ForgeCraft.Views.MapView extends Backbone.View

  tagName: 'div'
  className: 'map'
  
  initialize: ->

  start: ->
    @bindNavAction()
    @refresh()

  refresh: ->
    @topBarHeight   = $('.topbar').height();
    @htmlHeight     = $('html').height();
    $('.sidebar').css minHeight: @htmlHeight - @topBarHeight
    $('#map').find('.map').css minHeight: @htmlHeight - @topBarHeight

  bindNavAction: ->
    self = @
    $('.mine').click ->
      id = $(this).attr('data-id')
      self.selectMine(id)
      Backbone.history.navigate("map/" + id)

      return false

  selectMine: (id) ->
    id = id.toString().split('-')[0]

    $mine = $('#mine_' + id)
    if $mine.hasClass('selected')
      $mine.removeClass('selected')
    else
      $('.mine').removeClass('selected')
      $mine.addClass('selected')

