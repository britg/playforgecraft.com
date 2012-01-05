class Zone < ActiveRecord::Base
  has_many :items
  has_many :players
  has_many :mines

  validates_presence_of :name
  validates_presence_of :lower_level

  class << self

    def for_select
      all.map(&:for_select)  
    end

    def enabled
      where(:enabled => true)
    end

  end

  def serializable_hash(opts={})
    super((opts||{}).merge(:only => [:id, :name]))
  end

  def to_s
    name
  end

  def for_select
    [name, id]
  end

  def title
    "#{name} lvl #{lower_level}-#{upper_level}"
  end

  def range
    "#{lower_level}-#{upper_level}"
  end
  
end
