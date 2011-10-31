class AddCoinsToPlayers < ActiveRecord::Migration
  def change
    add_column :players, :coins, :integer, :default => 1000
  end
end
