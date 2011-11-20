class Action
  include MongoMapper::EmbeddedDocument
  plugin MongoMapper::Plugins::Timestamps

  belongs_to :battle

  TYPES = [ :message ]

  key :message,     String
  key :player_id,   Integer
  key :type,        String

  timestamps!

  def to_s
    message
  end

end
