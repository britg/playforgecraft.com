class Mine < ActiveRecord::Base

  has_many :requirements
  has_many :required_mines, :through => :prerequisites

  belongs_to :zone
  belongs_to :prize, :class_name => "Item"
  belongs_to :max_rarity, :class_name => "Rarity", :foreign_key => "max_rarity_id"

  accepts_nested_attributes_for :requirements, :reject_if => :all_blank

  before_create :default_max_rarity, :default_battle_chance

  default_scope order("level asc")

  def to_param
    "#{id}-#{name.gsub(/[^a-zA-Z0-9]+/, '-')}"
  end

  def to_s
    name
  end

  #-------

  def default_max_rarity
    self.max_rarity_id = Rarity.epic.try(:id) unless self.max_rarity_id.present?
  end

  def default_battle_chance
    self.battle_chance = 5 unless self.battle_chance.present?
  end
  
end
