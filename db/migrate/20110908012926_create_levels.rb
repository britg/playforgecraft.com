class CreateLevels < ActiveRecord::Migration
  def change
    create_table :levels do |t|
      t.integer :level
      t.integer :experience_required

      t.timestamps
    end

    add_index :levels, :level, :unique => true
  end
end
