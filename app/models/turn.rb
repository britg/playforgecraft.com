class Turn < ActiveRecord::Base

  belongs_to :game
  belongs_to :player
  belongs_to :loot

  has_and_belongs_to_many :tiles

  validates_presence_of :number
  validates_presence_of :game
  validates_presence_of :player
  validates_uniqueness_of :number, :scope => :game_id

end
