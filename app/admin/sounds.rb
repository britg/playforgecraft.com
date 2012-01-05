ActiveAdmin.register Sound do
  
  index do
    column :id
    column :name
    column :tag
    column :complete?
    column :enabled
    default_actions
  end

  form :html => { :enctype => "multipart/form-data" } do |f|
    
    f.inputs "Details" do
      f.input :name
      f.input :tag
      f.input :description
      f.input :enabled
    end
    f.buttons

    f.inputs "Files" do
      f.input :mp3
      f.input :ogg
      f.input :wav
    end

    f.buttons
  end
end
