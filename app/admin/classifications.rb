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
  
  form :html => { :enctype => "multipart/form-data" } do |f|
    
    f.inputs "Details" do
      f.input :name
      f.input :genre
    end

    f.inputs "Art", :multipart => true do
      f.input :default_icon
      f.input :default_art
    end

    f.buttons
  end

end
