class AddAttackIntervalToEnemies < ActiveRecord::Migration
  def change
    add_column :enemies, :attack_interval, :integer
  end
end
