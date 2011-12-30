# Crafty.audio.MAX_CHANNELS = 1
# Crafty.audio.add "swap", "/sounds/swap_stone.mp3"
# Crafty.audio.add("forge", ["/sounds/forge.mp3",
#                             "/sounds/forge.wav",
#                             "/sounds/forge.ogg"])
# Crafty.audio.add("slash", ["/sounds/slash.mp3",
#                             "/sounds/slash.wav",
#                             "/sounds/slash.ogg"])
# Crafty.audio.add "forge_bg", "/sounds/forge_bg.mp3"

ForgeCraft.Audio.sounds = {
  swap: new Audia("/sounds/swap_stone.mp3"),
  forge: new Audia("/sounds/forge.mp3"),
  slash: new Audia("/sounds/slash.mp3"),
  forge_bg: new Audia({
    src: "/sounds/forge_bg.mp3",
    loop: true
  })
}

ForgeCraft.Audio.play = (id, repeat) ->
  console.log "Sound settings are", ForgeCraft.Config.sound

  if repeat == -1
    return unless ForgeCraft.Config.sound.music
  else
    return unless ForgeCraft.Config.sound.effects
  
  sound = ForgeCraft.Audio.sounds[id]
  sound.play() if sound.play?

ForgeCraft.Audio.playMusic = () ->
  ForgeCraft.Audio.sounds['forge_bg'].play()

ForgeCraft.Audio.update = ->
  unless ForgeCraft.Config.sound.music
    ForgeCraft.Audio.sounds['forge_bg'].stop()
  else
    ForgeCraft.Audio.playMusic()

ForgeCraft.Audio.stop = (id) ->
  $.each ForgeCraft.Audio.sounds, (i, sound) ->
    sound.stop() if sound.stop?