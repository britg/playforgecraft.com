ActiveAdmin.register Mine do
  
  scope :all

  index do
    column :id
    column :name
    column :zone

    default_actions
  end
end
