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
  BATTLE_MUSIC:   "battle_music"
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

  playBattleMusic: ->
    return unless ForgeCraft.Config.sound.music
    id = @idByTag(@BATTLE_MUSIC)
    Crafty.audio.play id, -1 if id?

  stopMusic: ->
    @stop @FORGE_MUSIC
    @stop @BATTLE_MUSIC

  stop: (tag) ->
    id = @idByTag(tag)
    return unless id?
    elems = Crafty.audio._elems[id]
    el.pause() for el in elems

  update: ->
    unless ForgeCraft.Config.sound.music
      @stopMusic()
    else
      @playMusic() if window.location.pathname.match '/forges/'
      @playBattleMusic() if window.location.pathname.match '/enemies/'

  attackWith: (guard) ->
    tag = @[guard.toUpperCase() + "_ATTACK"]
    @play tag
