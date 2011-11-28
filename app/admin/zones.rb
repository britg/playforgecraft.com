ActiveAdmin.register Zone do

  scope :all

  index do
    column :id
    column :name
    column :range

    default_actions
  end
  
end
