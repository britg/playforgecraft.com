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
    , 1400


  showMessage: (message) ->
    $(@el).html(message).show()

    setTimeout =>
      $(@el).css fontSize: "800%"
    , 100

    setTimeout =>
      $(@el).fadeOut "fast", =>
        $(@el).css fontSize: "10px"
    , 1000