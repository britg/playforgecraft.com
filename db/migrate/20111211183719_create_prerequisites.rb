class CreatePrerequisites < ActiveRecord::Migration
  def change
    create_table :prerequisites do |t|

      t.references :mine
      t.references :required_mine

      t.timestamps

    end

    add_index :prerequisites, :mine_id
  end
end
