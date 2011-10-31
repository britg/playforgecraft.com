class ForgeCraft.Models.Player extends Backbone.Model
  paramRoot: 'player'

  defaults:
    level: 0
    coins: 0
  
class ForgeCraft.Collections.PlayersCollection extends Backbone.Collection
  model: ForgeCraft.Models.Player
  url: '/players'