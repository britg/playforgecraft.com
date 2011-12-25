class AddStatsToEnemies < ActiveRecord::Migration

  def change
    add_column :enemies, :attack, :integer
    add_column :enemies, :defense, :integer
    add_column :enemies, :random, :boolean, :default => true
    add_column :enemies, :battle_message, :string
  end

end
