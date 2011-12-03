class Progress
  include Mongoid::Document
  embedded_in :forge
  field :requirement_id, :type => Integer
  field :quantity, :type => Integer, :default => 0
  field :complete, :type => Boolean, :default => false

  after_update :check_completion

  def to_s
    "#{quantity}/#{requirement.to_s}"
  end

  def requirement
    Requirement.find(requirement_id)
  end

  def finished?
    (quantity >= requirement.quantity)
  end

  def complete?
    complete
  end

  def percent
    return 100.0 if complete?
    ((quantity.to_f / requirement.quantity.to_f) * 100.0).round
  end

  def increment_with_loot loot
    return if complete?
    self.update_attributes(:quantity => quantity+1) if counts?(loot)
  end

  def counts? loot
    ore_counts?(loot) and class_counts?(loot) \
    and genre_counts?(loot) and rarity_counts?(loot)
  end

  def ore_counts? loot
    return true unless requirement.ore_id.present?
    requirement.ore_id == loot.item.ore_id
  end

  def class_counts? loot
    return true unless requirement.classification_id.present?
    requirement.classification_id == loot.item.classification_id
  end

  def genre_counts? loot
    return true unless requirement.genre_id.present?
    requirement.genre_id == loot.item.genre_id
  end

  def rarity_counts? loot
    return true unless requirement.rarity_id.present?
    requirement.rarity_id == loot.item.rarity_id
  end

  def check_completion
    return true if complete?
    self.update_attributes(:complete => true) if finished?
    forge.check_completion
  end

end
