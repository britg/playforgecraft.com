@ClassTemplates = Backbone.Collection.extend

  model: Classification

  comparator: (classification) ->
    -classification.get("priority")
