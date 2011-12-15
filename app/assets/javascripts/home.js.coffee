#= require jquery
#= require lib/facebox

$ ->

  register = ->
    name = $('#player_name').val()
    $.facebox ajax: '/register?name=' + name
    return false

  $('.start').click ->
    register()

  $('#new_player').submit ->
    register()
    return false