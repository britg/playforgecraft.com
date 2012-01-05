class ForgeCraft.Models.Sound extends Backbone.Model

  initialize: ->
    @bind "add", @register, @

  register: ->
    Crafty.audio.add @get('id'), [@get('mp3_url'), 
                                  @get('ogg_url'), 
                                  @get('wav_url')]

class ForgeCraft.Collections.Sounds extends Backbone.Collection

  model: ForgeCraft.Models.Sound
  
  ORE_SWAP:       "ore_swap"
  FORGE_ITEM:     "forge_item"
  FORGE_MUSIC:    "forge_music"

  EQUIP_ITEM:     "equip_item"

  BATTLE_START:   "battle_start"
  BATTLE_WON:     "battle_won"
  BATTLE_LOST:    "battle_lost"
  ENEMY_ATTACK:   "enemy_attack"
  WARRIOR_ATTACK: "warrior_attack"
  THIEF_ATTACK:   "thief_attack"
  RANGER_ATTACK:  "ranger_attack"
  CRITICAL_HIT:   "critical_hit"

  initialize: ->
    Crafty.audio.MAX_CHANNELS = 1
    @bind "reset", @registerAll, @
    @registerAll()

  registerAll: ->
    Crafty.audio._elems = {}
    sound.register() for sound in @models

  prepareSounds: ->

  idByTag: (tag) ->
    matches = []
    for sound in @models
      matches.push(sound) if (sound.get('tag') == tag) 

    index = Math.floor(Math.random() * matches.length)
    sound = matches[index]
    if sound?
      return sound.get("id") 
    else
      return null

  play: (tag, repeat) ->
    return unless ForgeCraft.Config.sound.effects
    id = @idByTag(tag)
    Crafty.audio.play id, repeat if id?


  playMusic: ->
    return unless ForgeCraft.Config.sound.music
    id = @idByTag(@FORGE_MUSIC)
    Crafty.audio.play id, -1 if id?

  stopMusic: ->
    @stop @FORGE_MUSIC

  stop: (tag) ->
    id = @idByTag(tag)
    return unless id?
    elems = Crafty.audio._elems[id]
    el.pause() for el in elems

  update: ->
    unless ForgeCraft.Config.sound.music
      @stop(@FORGE_MUSIC)
    else
      @playMusic()

  attackWith: (guard) ->
    tag = @[guard.toUpperCase() + "_ATTACK"]
    @play tag



# Crafty.audio.MAX_CHANNELS = 1
# Crafty.audio.add "swap", "/sounds/swap_stone.mp3"
# Crafty.audio.add("forge", ["/sounds/forge.mp3",
#                             "/sounds/forge.wav",
#                             "/sounds/forge.ogg"])
# Crafty.audio.add("slash", ["/sounds/slash.mp3",
#                             "/sounds/slash.wav",
#                             "/sounds/slash.ogg"])
# Crafty.audio.add "forge_bg", "/sounds/forge_bg.mp3"

# Sounds.play = (id, repeat) ->
#   console.log "Sound settings are", ForgeCraft.Config.sound

#   if repeat == -1
#     return unless ForgeCraft.Config.sound.music
#   else
#     return unless ForgeCraft.Config.sound.effects
    
#   Crafty.audio.play id, repeat

# Sounds.playMusic = () ->
#   Sounds.play 'forge_bg', -1

# Sounds.update = ->
#   unless ForgeCraft.Config.sound.music
#     Sounds.stop('forge_bg')
#   else
#     Sounds.playMusic()

# Sounds.stop = (id) ->
#   elem = Crafty.audio._elems[id]
#   l = elem.length

#   # loop over every channel for a sound
#   for el in elem
#     el.pause()