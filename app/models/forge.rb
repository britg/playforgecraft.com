class Forge
  include Mongoid::Document

  field :mine_id, :type => Integer
  field :zone_id, :type => Integer
  field :player_id, :type => Integer
  field :funds, :type => Integer
  field :complete, :type => Boolean, :default => false
  field :requires_funding, :type => Boolean, :default => true
  field :battle_chance, :type => Integer

  index [:player_id, :mine_id], :unique => true

  embeds_many :progresses
  embeds_many :events

  after_create :create_progresses

  class << self

    def active
      where(:complete => false)
    end

    def completed
      where(:complete => true)
    end

  end

  def serializable_hash(opts={})
    super((opts||{}).merge(:methods => [:id, :progress_percent], :except => :events))
  end

  def to_s
    mine.to_s
  end

  def mine
    Mine.find(mine_id)
  end

  def max_rarity
    @max_rarity ||= mine.max_rarity
  end

  def has_rarity? rarity
    rarity.rank <= max_rarity.rank
  end

  def zone
    Zone.find(zone_id)
  end

  def player
    Player.find(player_id)
  end

  def loot
    Loot.where(:forge_id => to_param)
  end

  # Progress

  def progress_percent
    req_quantity = 0
    progress_quantity = 0
    
    progresses.each do |p|
      req_quantity += p.requirement.quantity
      progress_quantity += p.quantity
    end

    return 0 if req_quantity < 1

    ((progress_quantity.to_f / req_quantity.to_f) * 100.0).round
  end

  def update_progress loot
    progresses.each do |p|
      if loot.available? and !loot.equipped?
        p.increment_with_loot loot  
      else
        p.decrement_with_loot loot
      end
    end
  end

  def create_progresses
    mine.requirements.each do |req|
      progresses.create :requirement_id => req.id
    end
  end

  def requirements
    progresses.map(&:requirement)
  end

  def finished?
    progresses.each do |p|
      return false unless p.complete?
    end
    true
  end

  def complete?
    complete
  end

  def requires_funding?
    requires_funding
  end

  def check_completion
    self.update_attributes(:complete => finished?)
  end

  # Events

  def events_after time
    events.where(:created_at.gte => time).reverse
  end

  def generate_battle_event
    events.create(:type => Event::BATTLE_TYPE)
  end

  def generate_loot_event loot
    events.create(:type => Event::LOOT_TYPE, :loot_id => loot.id)
  end

  def generate_message_event msg
    events.create(:type => Event::MESSAGE_TYPE, :message => msg)
  end

end
