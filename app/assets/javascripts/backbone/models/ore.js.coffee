class ForgeCraft.Models.Ore extends Backbone.Model
  paramRoot: 'ore'

  defaults:
    x: 0
    y: 0
  
class ForgeCraft.Collections.OresCollection extends Backbone.Collection
  model: ForgeCraft.Models.Ore
  url: '/ores'