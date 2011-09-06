require 'test_helper'

class ClassificationTest < ActiveSupport::TestCase
  
  should belong_to :genre
  should have_many :items
  
end
