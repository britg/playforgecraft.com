class AddCoordinatesToMine < ActiveRecord::Migration
  def change
    add_column :mines, :x, :integer
    add_column :mines, :y, :integer
  end
end
