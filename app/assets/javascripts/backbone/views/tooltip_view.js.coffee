class ForgeCraft.Views.TooltipView extends Backbone.View

  initialize: ->
    @bindTooltips()

  bindTooltips: ->
    $('*[rel=tooltip]').facebox()