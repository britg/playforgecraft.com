class AddAttackDefenseToHeroes < ActiveRecord::Migration
  def change
    add_column :heroes, :attack, :integer, :default => 10
    add_column :heroes, :defense, :integer, :default => 10
  end
end
