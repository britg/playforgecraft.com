ActiveAdmin.register Item do
  
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
