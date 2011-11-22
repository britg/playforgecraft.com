class HeroSnapshot
  include MongoMapper::EmbeddedDocument
  plugin MongoMapper::Plugins::Timestamps
  plugin MongoMapper::Plugins::Associations

  embedded_in :battle

  key :name,        String
  key :job_id,      Integer
  key :job_name,    String
  key :attack,      Integer
  key :defense,     Integer
  key :weapon1_id,  Integer
  key :weapon2_id,  Integer
  key :armor_id,   Integer
  key :leggings_id, Integer

  class << self

    def snapshot_of hero
      {:name => hero.name,
       :job_id => hero.hero_class_id,
       :job_name => hero.job.to_s,
       :attack => hero.attack,
       :defense => hero.defense,
       :weapon1_id => hero.weapon1.try(:id),
       :weapon2_id => hero.weapon2.try(:id),
       :armor_id => hero.armor.try(:id),
       :leggings_id => hero.leggings.try(:id)}
    end

  end

  def to_s
    name||job_name.titleize
  end

end
