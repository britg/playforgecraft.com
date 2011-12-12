class CreateTooltips < ActiveRecord::Migration
  def change
    create_table :tooltips do |t|
      t.string :context
      t.string :title
      t.text :tip

      t.timestamps
    end
  end
end
