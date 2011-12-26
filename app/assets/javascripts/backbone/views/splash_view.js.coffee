class ForgeCraft.Views.SplashView extends Backbone.View

  initialize: ->
    @queue = []
    @running = false

  queueMessage: (message) ->
    @queue.push message
    @startQueue()

  startQueue: ->
    return if @running
    @showMessages()

  showMessages: ->
    # console.log "Show message called", @queue.length
    @running = @queue.length > 0
    return unless @running

    nextMsg = @queue.shift()
    # console.log "Presenting message", nextMsg
    @showMessage(nextMsg)
    setTimeout =>
      @showMessages()
    , ForgeCraft.Config.splash.queueDelay


  showMessage: (message) ->
    $(@el).html(message).show()

    setTimeout =>
      $(@el).css fontSize: "800%"
    , ForgeCraft.Config.splash.embiggenDelay

    setTimeout =>
      $(@el).fadeOut "fast", =>
        $(@el).css fontSize: "10px"
    , ForgeCraft.Config.splash.stickDelay