ActiveAdmin.register ItemSet do

  index do
    column :id
    column :name
    column :"# Items" do |set|
      set.items.count
    end
    column :icon do |set|
      image_tag set.icon, :class => "icon"
    end
    column :art do |set|
      image_tag set.art, :class => "art"
    end
    default_actions
  end

  form :html => { :enctype => "multipart/form-data" } do |f|
    
    f.inputs "Details" do
      f.input :name
      f.input :description
    end

    f.inputs "Art", :multipart => true do
      f.input :icon
      f.input :art
    end

    f.buttons

  end
  
end
