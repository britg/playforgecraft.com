class ForgeCraft.Views.MenuView extends Backbone.View

  tagName: 'div'

  initialize: ->
    @bindMenu()

  bindMenu: ->
    self = @
    $('.menu').click ->
      self.activateMenu()

  selectNav: (item) ->

    $('#navigation').find('a').removeClass('selected')
    $('#navigation').find('a.' + item).addClass('selected')

  activateMenu: ->
    console.log "Activating Menu"

    $.facebox ajax: "/menu"
    
    false
