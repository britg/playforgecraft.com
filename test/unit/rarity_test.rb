require 'test_helper'

class RarityTest < ActiveSupport::TestCase
  
  should have_many :items

  should validate_presence_of :name
  should validate_presence_of :rank

  context "A rarity" do
    
    setup do
      @rarity = Fabricate(:rarity)
    end

    should "respond to to_s with its name downcased" do
      assert_equal @rarity.name.downcase, @rarity.to_s
    end
  end
  
end
