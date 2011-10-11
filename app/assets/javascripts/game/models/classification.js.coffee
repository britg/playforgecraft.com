@Classification = Backbone.Model.extend
  
  defaults:
    name: ""
    priority: 0
    patterns: []

###
  Tunic
###

@tunic = new Classification
  name: "Tunic"
  priority: 5
  patterns:
    [
      [ [1, 0], [2, 0], [0, 1], [1, 1], [2, 1] ],
      [ [1, 0], [0, 1], [1, 1], [0, 2], [1, 2] ]
    ]

###
  Leggings
###

@leggings = new Classification
  name: "Legging"
  priority: 4
  patterns:
    [
      [ [1, 0], [0, 1], [0, 2], [1, 2] ],
      [ [0, 1], [1, 1], [2, 1], [2, 0] ],
      [ [1, 0], [1, 1], [1, 2], [0, 2] ],
      [ [0, 1], [1, 0], [2, 0], [2, 1] ],
    ]

###
  Crossbow
###

@crossbow = new Classification
  name: "Crossbow"
  priority: 3
  patterns:
    [
      [ [-1, 1], [0, 1], [1, 1], [0, 2] ],
    ]


###
  Axe
###

@axe = new Classification
  name: "Axe"
  priority: 2
  patterns:
    [
      [ [1, 0], [1, 1], [1, 2] ],
      [ [1, 0], [0, 1], [0, 2] ],
      [ [0, 1], [1, 1], [2, 1] ],
      [ [1, 0], [2, 0], [0, 1] ],
      [ [0, 1], [0, 2], [1, 2] ],
      [ [0, 1], [0, 2], [-1, 2] ],
      [ [0, 1], [-1, 1], [-2, 1] ],
      [ [1, 0], [2, 0], [2, 1] ]
    ]

###
  Shield
###

@shield = new Classification
  name: "Shield"
  priority: 1
  patterns:
    [
      [ [1, 0], [0, 1], [1, 1] ]
    ]


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