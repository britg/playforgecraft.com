require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  
  should belong_to :user

  should have_many :heroes
  should have_many :slots

  should validate_presence_of :name
  should validate_uniqueness_of :name

  setup do
    @player = Fabricate(:player)
  end

  context "With hero classes" do

    setup do
      bootstrap_hero_classes
      @player_with_heroes = Fabricate(:player, :name => "jebus")
    end

    should "have at least one hero" do
      assert (@player_with_heroes.heroes.count > 0)
    end
    
    should "begin with heroes for all hero_classes" do
      HeroClass.all.each do |hero_class|
        assert_not_nil @player_with_heroes.heroes.where(:hero_class => hero_class)
      end
    end

    should "return a hero by hero_class" do
      assert_equal HeroClass.first, @player_with_heroes.hero_for_class(HeroClass.first).job
    end

    should "have a warrior hero" do
      assert_not_nil @player_with_heroes.warrior
    end

    should "have a thief hero" do
      assert_not_nil @player_with_heroes.thief
    end

    should "have a ranger hero" do
      assert_not_nil @player_with_heroes.ranger
    end

  end

  should "set initial level to 1" do
    player = Player.create(:name => "Cheese")
    assert_equal 1, player.level
  end

  should "return name for to_s" do
    assert_equal "#{@player.name} (#{@player.level})", @player.to_s
  end

  should "return name for to_param" do
    assert_equal "#{@player.name}", @player.to_param
  end

  context "With rarities" do
    
    setup do
      bootstrap_rarities
      @rare = Fabricate(:item, :rarity => Rarity.of(:rare))
      @epic = Fabricate(:item, :rarity => Rarity.of(:epic))
      @set = Fabricate(:item, :rarity => Rarity.of(:set))
    end

    context "With any loot" do

      setup do
        @player.loot.create(:item => @epic)  
      end

      should "return item_count" do
        assert_equal 1, @player.item_count
      end

      should "return item_percent" do
        assert_equal 33, @player.item_percent
      end
      
    end

    context "Without any loot" do

      should "return item_count" do
        assert_equal 0, @player.item_count
      end

      should "return item_percent" do
        assert_equal 0, @player.item_percent
      end

    end

    context "With rare loot" do

      setup do
        @player.loot.create(:item => @rare)  
      end

      should "return rare_count" do
        assert_equal 1, @player.rare_count
      end

      should "return rare_percent" do
        assert_equal 100, @player.rare_percent
      end
      
    end

    context "Without rare loot" do

      should "return rare_count" do
        assert_equal 0, @player.rare_count
      end

      should "return rare_percent" do
        assert_equal 0, @player.rare_percent
      end

    end

    context "With epic loot" do

      setup do
        @player.loot.create(:item => @epic)  
      end

      should "return epic_count" do
        assert_equal 1, @player.epic_count
      end

      should "return epic_percent" do
        assert_equal 100, @player.epic_percent
      end
      
    end

    context "Without epic loot" do

      should "return epic_count" do
        assert_equal 0, @player.epic_count
      end

      should "return epic_percent" do
        assert_equal 0, @player.epic_percent
      end

    end

  end

end
