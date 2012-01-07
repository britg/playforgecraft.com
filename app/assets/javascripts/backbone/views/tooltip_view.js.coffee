class ForgeCraft.Views.TooltipView extends Backbone.View

  initialize: ->

  bindElements: (context = "body") ->
    @bindTooltips(context)
    @bindTips(context)
    @bindTimeago(context)

  bindTooltips: (context = "body") ->
    $(context).find('*[rel=tooltip]').facebox()

  bindTips: (context = "body")->
    $(context).find('*[data-tip]').qtip({

      content:
        attr: 'data-tip'

      position:
        target: 'mouse'

      style:
        classes: 'ui-tooltip-dark ui-tooltip-shadow ui-tooltip-tipsy'

    })

  bindTimeago: (context = "body") ->
    $(context).find('abbr.timeago').timeago()
