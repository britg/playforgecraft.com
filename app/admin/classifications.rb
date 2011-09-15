ActiveAdmin.register Classification do

  menu :label => "Classes"

  index do
    column :id
    column :name
    column :default_icon do |cl|
      image_tag cl.default_icon
    end
    column :default_art do |cl|
      image_tag cl.default_art
    end
    default_actions
  end
  
end
