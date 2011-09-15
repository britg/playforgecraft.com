ActiveAdmin.register Item do

  scope :all

  Rarity::DEFAULTS.each do |r|
    scope r.downcase.to_sym
  end

  index do
    column :id
    column :name do |item|
      link_to item, item_path(item), :class => ["item", item.rarity]
    end
    column :classification
    column :ore
    column :icon do |item|
      image_tag item.icon
    end
    column :art do |item|
      image_tag item.art
    end
    default_actions
  end
end
