class Forge
  include Mongoid::Document

  PERFECT_ACCURACY = 92
  UNLOCK_ACCURACY = 80
  DEFAULT_ACCURACY = 50

  field :mine_id, :type => Integer
  field :zone_id, :type => Integer
  field :player_id, :type => Integer
  field :level, :type => Integer
  field :complete, :type => Boolean, :default => false

  index [:player_id, :mine_id], :unique => true

  embeds_many :progresses
  embeds_many :events


  default_scope desc("level")

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
      if loot.available?
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

  def check_completion
    self.update_attributes(:complete => finished?)
  end

  # Events

  def events_after time
    events.where(:created_at.gte => time).reverse
  end

  def generate_training_event
    enemy = Enemy.training
    events.create(:type => Event::BATTLE_TYPE, :enemy_id => enemy.try(:id))
  end

  def generate_battle_event
    enemy = Enemy.for_forge(self)
    events.create(:type => Event::BATTLE_TYPE, :enemy_id => enemy.try(:id))
  end

  def generate_loot_event loot
    events.create(:type => Event::LOOT_TYPE, :loot_id => loot.id)
  end

  def generate_message_event msg
    events.create(:type => Event::MESSAGE_TYPE, :message => msg)
  end

  def generate_accuracy_events accuracy
    generate_message_event("Perfect Forge!") if accuracy >= PERFECT_ACCURACY
    generate_message_event("Ores Unlocked!") if accuracy >= UNLOCK_ACCURACY
  end

  def generate_battle_win_event enemy = nil
    e = events.build(:type => Event::BATTLE_WIN_TYPE)
    if enemy.try(:yields_loot?)
      loot = Loot.generate_battle_prize(self)
      loot.save
      e.loot_id = loot.id
    end
    e.save
  end

  def generate_battle_loss_event enemy = nil
    e = events.build(:type => Event::BATTLE_LOSS_TYPE)
    if enemy.try(:yields_loot?)
      loot = player.defeat_offering
      loot.update_attributes(:available => false)
      e.loot_id = loot.id
    end
    e.save
  end

  def restart!
    progresses.destroy_all
    create_progresses
    update_attributes(:complete => false)
  end

end
