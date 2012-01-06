class Score
  include Mongoid::Document
  field :player_id, :type => Integer
  field :score, :type => Integer
  field :battles_won, :type => Integer
  field :battles_lost, :type => Integer
  field :battles_won_percent, :type => Integer
  field :forges_complete, :type => Integer
  field :forges_complete_percent, :type => Integer
  field :total_items, :type => Integer
  field :total_items_percent, :type => Integer
  field :rare_items, :type => Integer
  field :rare_items_percent, :type => Integer
  field :epic_items, :type => Integer
  field :epic_items_percent, :type => Integer

  index :player_id

  def to_s
    score.to_s
  end

  def player
    Player.find_by_id(player_id)
  end
  
end
