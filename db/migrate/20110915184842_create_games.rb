class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|

      t.string :type

      t.references :challenger
      t.references :challengee

      t.references :winner
      t.references :loser

      t.integer :challenger_attack_score, :default => 0
      t.integer :challenger_defense_score, :default => 0
      t.integer :challengee_attack_score, :default => 0
      t.integer :challengee_defense_score, :default => 0

      t.integer :start_turns, :default => 0
      t.integer :challenger_turns_remaining, :default => 0
      t.integer :challengee_turns_remaining, :default => 0

      t.datetime :challenger_last_action
      t.datetime :challengee_last_action

      t.timestamps
    end

    add_index :games, :challenger_id
    add_index :games, :challengee_id
    add_index :games, :winner_id
    add_index :games, :loser_id
    add_index :games, :type

  end
end
