ActiveAdmin.register Item do

  scope :all

  Rarity::DEFAULTS.each do |r|
    scope r.downcase.to_sym
  end

  Classification::DEFAULTS.each do |type, classes|
    classes.each do |c|
      scope c.downcase.to_sym
    end
  end

  index do
    column :id
    column :name do |item|
      link_to item, item_path(item), :class => ["item", item.rarity]
    end
    column :type do |item|
      item.type
    end
    column :icon do |item|
      image_tag item.icon, :class => "icon"
    end
    column :art do |item|
      image_tag item.art, :class => "art"
    end
    default_actions
  end

  form :html => { :enctype => "multipart/form-data" } do |f|

    f.inputs "Details" do

      f.input :name
      f.input :active
      f.input :genre
      f.input :classification
      f.input :rarity
      f.input :item_set
      f.input :level

    end

    f.inputs "Art", :multipart => true do
      f.input :icon
      f.input :art
    end

    f.inputs "Stats" do
      f.input :attack_min
      f.input :attack_max
      f.input :defense_min
      f.input :defense_max
    end

    f.buttons

    f.inputs "Story" do
      f.input :description
      f.input :story
    end

    f.buttons

  end

end
