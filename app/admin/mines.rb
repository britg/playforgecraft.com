ActiveAdmin.register Mine do
  
  scope :all

  index do
    column :id
    column :name
    column :zone
    
    column :starting_funds do |mine|
      mine.requires_funding? ? mine.starting_funds.to_s : "No funds required"
    end

    column "Requirements" do |mine|
      reqs = []
      mine.requirements.each do |req|
        reqs << req
      end
      reqs.join("<br />").html_safe
    end

    column :max_rarity
    column :battle_chance

    default_actions
  end

  form do |f|

    f.inputs "Details" do
      f.input :name
      f.input :zone
      f.input :requires_funding
      f.input :starting_funds
      f.input :max_rarity
      f.input :battle_chance
    end

    f.object.requirements.build

    f.inputs :for => :requirements do |req|

      req.inputs "Requirement" do
        req.input :quantity
        req.input :rarity
        req.input :ore
        req.input :classification
        req.input :genre  
      end
        
    end
    
    f.inputs "Story" do
      f.input :description
      f.input :story  
    end

    f.buttons

  end
end
