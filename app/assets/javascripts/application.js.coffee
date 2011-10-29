#= require jquery
#= require jquery_ujs
#= require underscore
#= require backbone
#= require backbone_rails_sync
#= require backbone_datalink
#= require_tree ./lib
#= require backbone/forge_craft

$ ->




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