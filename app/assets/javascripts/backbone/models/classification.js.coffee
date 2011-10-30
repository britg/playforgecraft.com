class ForgeCraft.Models.Classification extends Backbone.Model
  
  defaults:
    name: ""
    priority: 0
    patterns: []

priority = 100

class ForgeCraft.Collections.ClassTemplates extends Backbone.Collection

###
  Tunic
###

@tunic = new ForgeCraft.Models.Classification
  name: "Tunic"
  priority: priority--
  patterns:
    [
      [ [1, 0], [2, 0], [0, 1], [1, 1], [2, 1] ],
      [ [1, 0], [0, 1], [1, 1], [0, 2], [1, 2] ]
    ]

###
  Leggings
###

@leggings = new ForgeCraft.Models.Classification
  name: "Legging"
  priority: priority--
  patterns:
    [
      # [ [1, 0], [0, 1], [0, 2], [1, 2] ],  # Currently disabled due to "gravity" problem
      [ [0, 1], [1, 1], [2, 1], [2, 0] ],
      # [ [1, 0], [1, 1], [1, 2], [0, 2] ],
      [ [0, 1], [1, 0], [2, 0], [2, 1] ],
    ]

###
  Crossbow
###

@crossbow = new ForgeCraft.Models.Classification
  name: "Crossbow"
  priority: priority--
  patterns:
    [
      [ [-1, 1], [0, 1], [1, 1], [0, 2], [0, 3] ],
      [ [-1, 1], [0, 1], [1, 1], [0, 2], [-2, 1] ],
      [ [-1, 1], [0, 1], [1, 1], [0, 2], [2, 1] ],
      [ [-1, 2], [0, 1], [1, 2], [0, 2], [0, 3] ],
    ]

###
  Sword
###

@longsword = new ForgeCraft.Models.Classification
  name: "Sword"
  priority: priority--
  patterns:
    [
      [ [1, 0], [2, 0], [3, 0] ],
      [ [0, 1], [0, 2], [0, 3] ]
    ]


###
  Axe
###

@axe = new ForgeCraft.Models.Classification
  name: "Axe"
  priority: priority--
  patterns:
    [
      [ [1, 0], [2, 0], [1, 1], [1, 2] ],
      [ [1, 0], [2, 0], [2, -1], [2, 1] ],
      [ [0, 1], [0, 2], [1, 1], [2, 1] ],
      [ [0, 1], [0, 2], [-1, 2], [1, 2] ]
    ]

###
  Shield
###

@shield = new ForgeCraft.Models.Classification
  name: "Shield"
  priority: priority--
  patterns:
    [
      [ [1, 0], [0, 1], [1, 1] ]
    ]


###
  Sword
###

@sword = new ForgeCraft.Models.Classification
  name: "Sword"
  priority: priority--
  patterns:
    [
      [ [1, 0], [2, 0] ],
      [ [0, 1], [0, 2] ]
    ]

ForgeCraft.ClassTemplates = new ForgeCraft.Collections.ClassTemplates([@tunic, @leggings, @crossbow, @longsword, @axe, @shield])