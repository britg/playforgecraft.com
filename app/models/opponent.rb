class Opponent
  include MongoMapper::Document

  key :name, String
  key :level, Integer

end
