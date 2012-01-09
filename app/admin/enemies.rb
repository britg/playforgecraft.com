ActiveAdmin.register Enemy do

  scope :all

  index do
    column :id
    column :name
    column :level
    column :attack
    column :defense
    column :attack_interval

    default_actions
  end

  form do |f|
    
    f.inputs "Details" do
      f.input :name
      f.input :level
      f.input :battle_message
      f.input :attack
      f.input :defense
      f.input :attack_interval
    end

    f.buttons
    
  end
  
end
