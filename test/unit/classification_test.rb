require 'test_helper'

class ClassificationTest < ActiveSupport::TestCase
  
  should belong_to :genre
  should have_many :items

  should validate_presence_of :name
  should validate_presence_of :genre
  
  context "A classification" do

    setup do
      @class = Fabricate(:classification)  
    end

    should "respond to to_s with its name pluralized" do
      assert_equal @class.name.pluralize, @class.to_s
    end
    
  end


end
