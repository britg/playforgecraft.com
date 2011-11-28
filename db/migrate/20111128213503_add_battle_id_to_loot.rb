class AddBattleIdToLoot < ActiveRecord::Migration
  def change
    add_column :loots, :battle_id, :string
  end
end
