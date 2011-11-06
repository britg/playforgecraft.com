require 'test_helper'

class HeroClassTest < ActiveSupport::TestCase

  should validate_presence_of :name
  should_allow_values_for :name, :warrior, :thief, :ranger

  setup do
    bootstrap_hero_classes
  end

  should "have an existing warrior class" do
    assert_not_nil HeroClass.warrior
  end

  should "have an existing thief class" do
    assert_not_nil HeroClass.thief
  end

  should "have an existing ranger class" do
    assert_not_nil HeroClass.ranger
  end

end
