class Event
  include Mongoid::Document

  embedded_in :forge

  field :type
  field :loot_id, :type => Integer

end