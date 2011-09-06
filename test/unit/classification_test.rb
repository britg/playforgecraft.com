require 'test_helper'

class ClassificationTest < ActiveSupport::TestCase
  
  should belong_to :genre
  should have_many :items

  should validate_presence_of :name
  should validate_presence_of :genre
  
end
