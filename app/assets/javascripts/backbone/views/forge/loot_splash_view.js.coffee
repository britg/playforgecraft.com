class ForgeCraft.Views.LootSplashView extends Backbone.View

  initialize: ->

  showSplash: ->
    console.log @model
    id = Math.round(Math.random() * 10000)

    $ore = $('.ore.marked')
    width = $ore.width()
    top = $ore.position().top + width
    left = $ore.position().left

    $('body').append("<div id=\"" + id + "\" class=\"loot-splash " + @model.get("item_attributes")["type"] + "\" style=\"left:" + left + "px; top:" + top + "px;\"><img class=\"icon\" src=\"" + @model.get("item_attributes")["icon_url"] + "\" />" + @model.get("item_attributes")["name"] + "</div>")

    $splash = $('#' + id)
    top = $splash.position().top
    $splash.css top: top-10

    setTimeout =>
      @zipOff($splash)
    , 1000

  zipOff: ($splash) ->
    $e = $('.event').first()
    width = $e.width()
    left = $e.position().left
    top = $e.position().top

    console.log "going to", left, top
    $splash.css left: left, top: top

    $splash.bind CSS3_TRANSITION_END, =>
      $splash.remove()