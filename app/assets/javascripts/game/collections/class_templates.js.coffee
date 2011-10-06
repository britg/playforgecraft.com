@ClassTemplates = Backbone.Collection.extend

  model: Classification

  comparitor: (classification) ->
    classification.get("priority")
