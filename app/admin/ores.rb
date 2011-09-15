ActiveAdmin.register Ore do

  index do
    column :id
    
    column :tile do |ore|
      image_tag ore.tile.url
    end

    column :name
    column :rank
    
    default_actions
  end

  form :html => { :enctype => "multipart/form-data" } do |f|

    f.inputs "Ore", :multipart => true do
      f.input :name
      f.input :rank
      f.input :tile
    end    

    f.buttons

  end
end
