ActiveAdmin.register Mine do
  
  scope :all

  index do
    column :id
    column :name
    column :zone
    column :starting_funds
    column "Requirements" do |mine|
      reqs = []
      mine.requirements.each do |req|
        reqs << req
      end
      reqs.join("\n")
    end

    default_actions
  end

  form do |f|

    f.inputs "Details" do
      f.input :name
      f.input :zone
      f.input :starting_funds  
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
