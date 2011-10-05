class Action < ActiveRecord::Base

  belongs_to :game
  belongs_to :player
  belongs_to :loot

  has_and_belongs_to_many :tiles

end
