$(function () {

  $('a[data-method=delete]').live('ajax:complete', function () {
    ForgeCraft.reloadSelectedTab();
  });
  
});