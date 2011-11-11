class ForgeCraft.Views.MenuView extends Backbone.View

  tagName: 'div'

  initialize: ->
    @bindMenu()
    @bindTooltips()

  bindMenu: ->
    self = @
    $('.menu').click ->
      self.activateMenu()

  bindTooltips: ->
    $('.nav-item').twipsy()

  selectNav: (item) ->

    $('#navigation').find('a').removeClass('selected')
    $('#navigation').find('a.' + item).addClass('selected')

  activateMenu: ->
    console.log "Activating Menu"

    $.facebox ajax: "/menu"
    
    false
