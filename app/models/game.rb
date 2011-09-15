class Game < ActiveRecord::Base

  TYPES = [:singleplayer, :multiplayer, :freeplay]
  DEFAULT_TURNS = 100

  belongs_to :challenger, :class_name => "Player"
  belongs_to :challengee, :class_name => "Player"
  belongs_to :winner, :class_name => "Player"
  belongs_to :loser, :class_name => "Player"



end
