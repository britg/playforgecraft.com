(function() {
  Crafty.audio.MAX_CHANNELS = 1;
  Crafty.audio.add("swap", "/sounds/swap_stone.mp3");
  Crafty.audio.add("forge", ["/sounds/forge.mp3", "/sounds/forge.wav", "/sounds/forge.ogg"]);
  Crafty.audio.add("slash", ["/sounds/slash.mp3", "/sounds/slash.wav", "/sounds/slash.ogg"]);
  Crafty.audio.add("forge_bg", "/sounds/forge_bg.mp3");
  ForgeCraft.Audio.play = function(id, repeat) {
    console.log("Sound settings are", ForgeCraft.Config.sound);
    if (repeat === -1) {
      if (!ForgeCraft.Config.sound.music) {
        return;
      }
    } else {
      if (!ForgeCraft.Config.sound.effects) {
        return;
      }
    }
    return Crafty.audio.play(id, repeat);
  };
  ForgeCraft.Audio.playMusic = function() {
    return ForgeCraft.Audio.play('forge_bg', -1);
  };
  ForgeCraft.Audio.update = function() {
    if (!ForgeCraft.Config.sound.music) {
      return ForgeCraft.Audio.stop('forge_bg');
    } else {
      return ForgeCraft.Audio.playMusic();
    }
  };
  ForgeCraft.Audio.stop = function(id) {
    var el, elem, l, _i, _len, _results;
    elem = Crafty.audio._elems[id];
    l = elem.length;
    _results = [];
    for (_i = 0, _len = elem.length; _i < _len; _i++) {
      el = elem[_i];
      _results.push(el.pause());
    }
    return _results;
  };
}).call(this);
