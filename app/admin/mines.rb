ActiveAdmin.register Mine do
  
  scope :all

  index do
    column :id
    column :name
    column :zone
    column :starting_funds

    default_actions
  end
end
