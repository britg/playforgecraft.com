ActiveAdmin.register Enemy do

  scope :all

  index do
    column :id
    column :name
    column :attack
    column :defense
    column :random

    default_actions
  end

  form do |f|
    
    f.inputs "Details" do
      f.input :name
      f.input :random
      f.input :battle_message
      f.input :attack
      f.input :defense
    end

    f.buttons
    
  end
  
end
