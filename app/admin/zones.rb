ActiveAdmin.register Zone do

  menu false

  scope :all

  index do
    column :id
    column :name
    column :enabled

    default_actions
  end
  
end
