class Action
  include MongoMapper::EmbeddedDocument
  plugin MongoMapper::Plugins::Timestamps

  embedded_in :battle

  TYPES = [ :message, :action, :notification ]

  key :message,     String
  key :player_id,   Integer
  key :player_name, String
  key :type,        String

  timestamps!

  def serializable_hash opts={}
    super((opts||{}).merge(:methods => [:to_log]))
  end

  def to_s
    to_log
  end

  def to_log
    "#{player_name}: #{message}"
  end

end
