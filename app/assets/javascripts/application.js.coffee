#= require jquery
#= require jquery_ujs
#= require underscore
#= require backbone
#= require backbone_rails_sync
#= require backbone_datalink
#= require_tree ./lib
#= require backbone/forge_craft

$ ->
  window.router = new ForgeCraft.Routers.Router

  window.flashView = new ForgeCraft.Views.FlashView el: $('#flash-wrap').get(0)
  window.loadingView = new ForgeCraft.Views.LoadingView el: $('#loading').get(0)
  window.player = new ForgeCraft.Models.Player ForgeCraft.Config.player
  window.playerView = new ForgeCraft.Views.PlayerView el: $('#profile').get(0), model: player
  window.menuView = new ForgeCraft.Views.MenuView

  forging = (window.location.pathname == "/forge")
  Backbone.history.start(pushState: true, silent: !forging)

  $('a').live 'click', ->
    unless $(@).attr('data-external')
      r = $(@).attr('href').slice(1)
      Backbone.history.navigate(r, true)

      return false




# $(function () {
  
#   $.defaultText();
#   ForgeCraft.bindDefaultHandlers('body');

#   $('.tab-control').tabs({
    
#     select: function (event, ui) { 
#       window.location.hash = ui.tab.hash;
#     },

#     load: function (event, ui) {
#       ForgeCraft.bindDefaultHandlers(ui.panel);
#     }

#   });

#   $.address.change(function (event) {
#     $('.tab-control').tabs( "select" , window.location.hash )
#   });

#   $(document).bind('reveal.facebox', function () {
#     ForgeCraft.bindDefaultHandlers('#facebox');
#   });

# });

# var ForgeCraft = {

#   bindDefaultHandlers: function (context) {
#     $(context).find('form').validate();
#     $(context).find('a[rel=modal]').facebox();
#   },
  
#   reloadSelectedTab: function () {
#     $tabs = $('#armory-content.tab-control').tabs();
#     $tabs.tabs('load', $tabs.tabs('option', 'selected'));
#   }

# }