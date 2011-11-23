class Play
  include Mongoid::Document

  embedded_in :playbook

  # key :player, Integer
  # key :hero, String
  # key :action, String

  field :player, :type => Integer
  field :hero
  field :action

end
