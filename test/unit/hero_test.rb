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

  context "A player's hero" do
    
    setup do
      bootstrap_hero_classes
      @player = Fabricate(:player)
      @hero = @player.warrior
    end

    should "begin with no loot in a slot" do
      assert_equal nil, @hero.weapon1
    end

    context "with loot" do

      setup do
        @loot = Fabricate(:loot)  
      end
      
      should "equip loot to a slot by symbol" do
        assert_equal true, @hero.equip!(:weapon1, @loot)
        assert_equal @hero.weapon1, @loot
      end

      should "equip loot to a slot by slot object" do
        assert_equal true, @hero.equip!(@hero.weapon1_slot, @loot)
        assert_equal @hero.weapon1, @loot
      end

    end

    context "With loot that's a higher level" do
      
      setup do
        @item = Fabricate(:item, :level => @player.level + 1)
         @loot = Fabricate(:loot, :player => @player, :item => @item)
      end

      should "Not be equippable" do
        assert false
      end

    end

  end

end
