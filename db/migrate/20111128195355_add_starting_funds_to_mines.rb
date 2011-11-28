class AddStartingFundsToMines < ActiveRecord::Migration
  def change
    add_column :mines, :starting_funds, :integer
  end
end
