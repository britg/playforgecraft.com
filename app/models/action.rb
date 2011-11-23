class Action
  include MongoMapper::EmbeddedDocument
  plugin MongoMapper::Plugins::Timestamps
  plugin MongoMapper::Plugins::Callbacks

  embedded_in :battle

  TYPES = [ :message, :attack, :notification ]

  key :message,     String
  key :player_id,   String
  key :player_name, String
  key :hero_id,     String
  key :hero_name,   String
  key :type,        String
  key :play,        Integer
  key :target_id,   String
  key :target_name, String
  key :damage_dealt, Integer

  timestamps!

  before_create :run_action

  def serializable_hash opts={}
    super((opts||{}).merge(:methods => [:to_log]))
  end

  def to_s
    to_log
  end

  def to_log
    "#{player_name}: #{message}"
  end

  def is_attack?
    self.type.to_s == 'attack'
  end

  #----

  def run_action
    self.damage_dealt = 10
  end

end
