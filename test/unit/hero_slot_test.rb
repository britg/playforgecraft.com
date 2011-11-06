require 'test_helper'

class HeroSlotTest < ActiveSupport::TestCase
  
  should belong_to :hero
  should belong_to :player
  should belong_to :loot

  should_allow_values_for :name

end
