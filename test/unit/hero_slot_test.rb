require 'test_helper'

class HeroSlotTest < ActiveSupport::TestCase
  
  should belong_to :hero
  should belong_to :player
  should belong_to :loot

  should_allow_values_for :name

  context "The HeroSlot class" do
    
    should "have a weapon1 scope" do
      assert_not_nil HeroSlot.weapon1
    end

    should "have a weapon2 scope" do
      assert_not_nil HeroSlot.weapon2
    end

    should "have an armor scope" do
      assert_not_nil HeroSlot.armor
    end

    should "have a leggings scope" do
      assert_not_nil HeroSlot.leggings
    end

  end

  context "A slot" do
    
    setup do
      bootstrap_hero_classes
      @player = Fabricate(:player)
      @slot = @player.warrior.weapon1_slot
    end

    should "return its slot type to to_s" do
      assert_equal @slot.slot.to_s, @slot.to_s
    end

  end

  context "With a player's heroes and loot of each class" do
    
    setup do
      bootstrap_hero_classes
      @player = Fabricate(:player)
      @loot = bootstrap_loot
    end

    context "a warrior's weapon1 slot" do
      
      setup do
        @slot = @player.warrior.weapon1_slot
      end

      should "accept a sword" do
        assert_equal true, @slot.accepts?(@loot["Sword"])
      end

      should "accept an axe" do
        assert_equal true, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "not accept a tunic" do
        assert_equal false, @slot.accepts?(@loot["Tunic"])
      end

      should "not accept a legging" do
        assert_equal false, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a warrior's weapon2 slot" do
      
      setup do
        @slot = @player.warrior.weapon2_slot
      end

      should "not accept a sword" do
        assert_equal false, @slot.accepts?(@loot["Sword"])
      end

      should "not accept an axe" do
        assert_equal false, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "not accept a tunic" do
        assert_equal false, @slot.accepts?(@loot["Tunic"])
      end

      should "not accept a legging" do
        assert_equal false, @slot.accepts?(@loot["Legging"])
      end

      should "accept a shield" do
        assert_equal true, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a warrior's armor slot" do
      
      setup do
        @slot = @player.warrior.armor_slot
      end

      should "not accept a sword" do
        assert_equal false, @slot.accepts?(@loot["Sword"])
      end

      should "not accept an axe" do
        assert_equal false, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "accept a tunic" do
        assert_equal true, @slot.accepts?(@loot["Tunic"])
      end

      should "not accept a legging" do
        assert_equal false, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a warrior's legging slot" do
      
      setup do
        @slot = @player.warrior.leggings_slot
      end

      should "not accept a sword" do
        assert_equal false, @slot.accepts?(@loot["Sword"])
      end

      should "not accept an axe" do
        assert_equal false, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "not accept a tunic" do
        assert_equal false, @slot.accepts?(@loot["Tunic"])
      end

      should "accept a legging" do
        assert_equal true, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a thief's weapon1 slot" do
      
      setup do
        @slot = @player.thief.weapon1_slot
      end

      should "accept a sword" do
        assert_equal true, @slot.accepts?(@loot["Sword"])
      end

      should "accept an axe" do
        assert_equal true, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "not accept a tunic" do
        assert_equal false, @slot.accepts?(@loot["Tunic"])
      end

      should "not accept a legging" do
        assert_equal false, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a thief's weapon2 slot" do
      
      setup do
        @slot = @player.thief.weapon2_slot
      end

      should "accept a sword" do
        assert_equal true, @slot.accepts?(@loot["Sword"])
      end

      should "accept an axe" do
        assert_equal true, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "not accept a tunic" do
        assert_equal false, @slot.accepts?(@loot["Tunic"])
      end

      should "not accept a legging" do
        assert_equal false, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a thief's armor slot" do
      
      setup do
        @slot = @player.thief.armor_slot
      end

      should "not accept a sword" do
        assert_equal false, @slot.accepts?(@loot["Sword"])
      end

      should "not accept an axe" do
        assert_equal false, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "accept a tunic" do
        assert_equal true, @slot.accepts?(@loot["Tunic"])
      end

      should "not accept a legging" do
        assert_equal false, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a thief's legging slot" do
      
      setup do
        @slot = @player.thief.leggings_slot
      end

      should "not accept a sword" do
        assert_equal false, @slot.accepts?(@loot["Sword"])
      end

      should "not accept an axe" do
        assert_equal false, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "not accept a tunic" do
        assert_equal false, @slot.accepts?(@loot["Tunic"])
      end

      should "accept a legging" do
        assert_equal true, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a ranger's weapon1 slot" do
      
      setup do
        @slot = @player.ranger.weapon1_slot
      end

      should "not accept a sword" do
        assert_equal false, @slot.accepts?(@loot["Sword"])
      end

      should "not accept an axe" do
        assert_equal false, @slot.accepts?(@loot["Axe"])
      end

      should "accept a crossbow" do
        assert_equal true, @slot.accepts?(@loot["Crossbow"])
      end

      should "not accept a tunic" do
        assert_equal false, @slot.accepts?(@loot["Tunic"])
      end

      should "not accept a legging" do
        assert_equal false, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a ranger's weapon2 slot" do
      
      setup do
        @slot = @player.ranger.weapon2_slot
      end

      should "not accept a sword" do
        assert_equal false, @slot.accepts?(@loot["Sword"])
      end

      should "not accept an axe" do
        assert_equal false, @slot.accepts?(@loot["Axe"])
      end

      should "accept a crossbow" do
        assert_equal true, @slot.accepts?(@loot["Crossbow"])
      end

      should "not accept a tunic" do
        assert_equal false, @slot.accepts?(@loot["Tunic"])
      end

      should "not accept a legging" do
        assert_equal false, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a ranger's armor slot" do
      
      setup do
        @slot = @player.ranger.armor_slot
      end

      should "not accept a sword" do
        assert_equal false, @slot.accepts?(@loot["Sword"])
      end

      should "not accept an axe" do
        assert_equal false, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "accept a tunic" do
        assert_equal true, @slot.accepts?(@loot["Tunic"])
      end

      should "not accept a legging" do
        assert_equal false, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

    context "a ranger's legging slot" do
      
      setup do
        @slot = @player.ranger.leggings_slot
      end

      should "not accept a sword" do
        assert_equal false, @slot.accepts?(@loot["Sword"])
      end

      should "not accept an axe" do
        assert_equal false, @slot.accepts?(@loot["Axe"])
      end

      should "not accept a crossbow" do
        assert_equal false, @slot.accepts?(@loot["Crossbow"])
      end

      should "not accept a tunic" do
        assert_equal false, @slot.accepts?(@loot["Tunic"])
      end

      should "accept a legging" do
        assert_equal true, @slot.accepts?(@loot["Legging"])
      end

      should "not accept a shield" do
        assert_equal false, @slot.accepts?(@loot["Shield"])
      end

    end

  end

end
