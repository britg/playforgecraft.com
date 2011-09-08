class AddAttachmentTileToOre < ActiveRecord::Migration
  def self.up
    add_column :ores, :tile_file_name, :string
    add_column :ores, :tile_content_type, :string
    add_column :ores, :tile_file_size, :integer
    add_column :ores, :tile_updated_at, :datetime
  end

  def self.down
    remove_column :ores, :tile_file_name
    remove_column :ores, :tile_content_type
    remove_column :ores, :tile_file_size
    remove_column :ores, :tile_updated_at
  end
end
