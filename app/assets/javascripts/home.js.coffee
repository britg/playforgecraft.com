#= require jquery
#= require lib/facebox

$ ->

  register = ->
    name = $('#player_name').val()
    $.facebox ajax: '/register?name=' + name
    return false

  $('.start').click ->
    register()
    return false

  $('#new_player').submit ->
    register()
    return false

  $('.log-in-link').click ->
    $.facebox ajax: '/login'
    return false