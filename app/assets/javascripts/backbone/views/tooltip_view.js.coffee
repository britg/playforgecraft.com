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
        my: 'top center',
        at: 'bottom center'

      style:
        classes: 'ui-tooltip-dark ui-tooltip-shadow ui-tooltip-tipsy'

      hide:
        event: 'click mouseleave'

    })

  bindTimeago: (context = "body") ->
    $(context).find('abbr.timeago').timeago()
