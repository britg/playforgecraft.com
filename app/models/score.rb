class Score
  include Mongoid::Document
  field :player_id, :type => Integer
  field :score, :type => Integer
  field :forges_complete, :type => Integer
  field :total_items, :type => Integer
  field :advanced_items, :type => Integer
  field :rare_items, :type => Integer
  field :epic_items, :type => Integer

  index :player_id, :unique => true
  index :score

  def to_s
    score.to_s
  end

  def player
    Player.find_by_id(player_id)
  end
  
end
