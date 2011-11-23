class Play
  include MongoMapper::EmbeddedDocument

  embedded_in :playbook

  key :player, Integer
  key :hero, String
  key :action, String

end
