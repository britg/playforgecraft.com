@Classification = Backbone.Model.extend
  
  defaults:
    name: ""
    priority: 0
    patterns: []


###
  Sword
###

@sword = new Classification
  name: "Sword"
  priority: 0
  patterns:
    [
      [ [1, 0], [2, 0] ],
      [ [0, 1], [0, 2] ]
    ]