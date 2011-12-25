class AddStatsToEnemies < ActiveRecord::Migration

  def change
    add_column :enemies, :attack, :integer
    add_column :enemies, :defense, :integer
  end

end
