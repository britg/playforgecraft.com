// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

$(function () {
  
  $.defaultText();
  ForgeCraft.bindDefaultHandlers('body');

  $('.tab-control').tabs({
    
    select: function (event, ui) { 
      window.location.hash = ui.tab.hash;
    },

    load: function (event, ui) {
      ForgeCraft.bindDefaultHandlers(ui.panel);
    }

  });

  $.address.change(function (event) {
    $('.tab-control').tabs( "select" , window.location.hash )
  })

  $(document).bind('reveal.facebox', function () {
    ForgeCraft.bindDefaultHandlers('#facebox');
  });

});

var ForgeCraft = {

  bindDefaultHandlers: function (context) {
    $(context).find('form').validate();
    $(context).find('a[rel=modal]').facebox();
  },
  
  reloadSelectedTab: function () {
    $tabs = $('#armory-content.tab-control').tabs();
    $tabs.tabs('load', $tabs.tabs('option', 'selected'));
  }

}