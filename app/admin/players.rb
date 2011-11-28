ActiveAdmin.register Player do

  scope :all

  index do
    column :id
    column :name
    default_actions
  end
  
end
