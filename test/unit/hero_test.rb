require 'test_helper'

class HeroTest < ActiveSupport::TestCase
  
  should belong_to :player
  should belong_to :job
  should have_many :slots
  
  should validate_presence_of :name
  should validate_presence_of :job
  should validate_presence_of :player

  context "The Hero class" do

    setup do
      bootstrap_hero_classes
      @player = Fabricate(:player)
      @player.heroes.destroy_all
    end

    should "create_heroes_for player" do
      assert_difference "Hero.count", HeroClass.count do
        Hero.create_heroes_for @player
      end
    end

  end

  context "A new hero" do
    
    setup do
      bootstrap_hero_classes
      @player = Fabricate(:player)
      @hero = Fabricate.build(:hero, :job => HeroClass.warrior, :player => @player)
    end

    should "Create all slots for the hero" do
      assert_difference("HeroSlot.count", HeroSlot::SLOTS.count) do
        @hero.save
      end
    end

  end

end
