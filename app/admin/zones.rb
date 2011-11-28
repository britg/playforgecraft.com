ActiveAdmin.register Zone do

  menu :label => "Map"

  scope :all

  index do
    column :id
    column :name
    column :range

    default_actions
  end
  
end
