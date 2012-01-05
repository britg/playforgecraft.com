class CreateSounds < ActiveRecord::Migration
  def change
    create_table :sounds do |t|
      t.string :name
      t.string :tag
      t.text :description
      t.boolean :loops

      t.string :mp3_file_name
      t.integer :mp3_file_size
      t.string :mp3_content_type
      t.string :mp3_updated_at

      t.string :ogg_file_name
      t.integer :ogg_file_size
      t.string :ogg_content_type
      t.string :ogg_updated_at

      t.string :wav_file_name
      t.integer :wav_file_size
      t.string :wav_content_type
      t.string :wav_updated_at

      t.timestamps
    end
    add_index :sounds, :tag
  end
end
