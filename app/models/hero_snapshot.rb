class HeroSnapshot
  include Mongoid::Document

  embedded_in :battle

  field :name
  field :job_id, :type => Integer
  field :job_name
  field :attack, :type => Integer
  field :defense, :type => Integer
  field :weapon1_id, :type => Integer
  field :weapon2_id, :type => Integer
  field :armor_id, :type => Integer
  field :leggings_id, :type => Integer

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

  def to_css_class
    job_name
  end

end
