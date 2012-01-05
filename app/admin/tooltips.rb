ActiveAdmin.register Tooltip do

  index do
    column :id
    column :page
    column :title
    column :context
    column :has_image?

    default_actions
  end

  form :html => { :enctype => "multipart/form-data" } do |f|

    f.inputs "Details" do
      f.input :title
      f.input :context
      f.input :page
      f.input :image
    end

    f.buttons

  end

end
