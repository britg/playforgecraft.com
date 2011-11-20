class Battle
  include MongoMapper::Document

  key :player_ids, Array

end
