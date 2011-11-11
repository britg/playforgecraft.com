class HeroClass < ActiveRecord::Base

  CLASSES = [:warrior, :thief, :ranger]

  validates_presence_of :name
  validates_inclusion_of :name, :in => CLASSES

  class << self

    def warrior
      find_by_name(:warrior)
    end

    def thief
      find_by_name(:thief)
    end

    def ranger
      find_by_name(:ranger)
    end

    def bootstrap
      CLASSES.each do |hero_class|
        create(:name => hero_class) unless self.send(hero_class).present?
      end
    end

  end

  def to_s
    attributes["name"]
  end

  def name
    attributes["name"].to_sym
  end

end