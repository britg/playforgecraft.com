Crafty.audio.MAX_CHANNELS = 1
Crafty.audio.add "swap", "/sounds/swap_stone.mp3"
Crafty.audio.add("forge", ["/sounds/forge.mp3",
                            "/sounds/forge.wav",
                            "/sounds/forge.ogg"])
Crafty.audio.add("slash", ["/sounds/slash.mp3",
                            "/sounds/slash.wav",
                            "/sounds/slash.ogg"])
Crafty.audio.add "forge_bg", "/sounds/forge_bg.mp3"

ForgeCraft.Audio.play = (id, repeat) ->
  console.log "Sound settings are", ForgeCraft.Config.sound

  if repeat == -1
    return unless ForgeCraft.Config.sound.music
  else
    return unless ForgeCraft.Config.sound.effects
    
  Crafty.audio.play id, repeat

ForgeCraft.Audio.playMusic = () ->
  ForgeCraft.Audio.play 'forge_bg', -1

ForgeCraft.Audio.update = ->
  unless ForgeCraft.Config.sound.music
    ForgeCraft.Audio.stop('forge_bg')
  else
    ForgeCraft.Audio.playMusic()

ForgeCraft.Audio.stop = (id) ->
  elem = Crafty.audio._elems[id]
  l = elem.length

  # loop over every channel for a sound
  for el in elem
    el.pause()