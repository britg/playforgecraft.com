
Crafty.audio.add "swap", "/sounds/swap_stone.mp3"
Crafty.audio.add "forge", "/sounds/forge.mp3"
Crafty.audio.add "forge_bg", "/sounds/forge_bg.mp3"

ForgeCraft.Audio.play = (id, repeat) ->
  console.log "Sound settings are", ForgeCraft.Config.sound

  if repeat == -1
    return unless ForgeCraft.Config.sound.music
  else
    return unless ForgeCraft.Config.sound.effects
    
  Crafty.audio.play id, repeat