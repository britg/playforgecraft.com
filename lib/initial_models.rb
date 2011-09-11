
module ForgeCraft
  class InitialModels
    
    class << self

      def create

        if Item.any?
          puts "Cannot run initialize as items already exist!"
          return
        end

        create_ores
        create_rarities
        create_genres
        create_classifications
        create_levels
      end

      def reset
        ["ores", "rarities", "genres", "classifications", "levels"].each do |t|
          ActiveRecord::Base.connection.execute("DELETE FROM `#{t}`")
          ActiveRecord::Base.connection.execute("TRUNCATE `#{t}`") rescue nil;
        end
      end

      def create_ores
        Ore.delete_all

        Ore::DEFAULTS.each_with_index do |t, i|
          Ore.create :name => t, :rank => i
        end
      end 

      def create_rarities
        Rarity.delete_all

        Rarity::DEFAULTS.each_with_index do |r, i|
          Rarity.create :name => r, :rank => i
        end
      end

      def create_genres
        Genre.delete_all

        Genre::DEFAULTS.each_with_index do |g, i|
          Genre.create :name => g
        end
      end

      def create_classifications
        Classification.delete_all

        Classification::DEFAULTS.each do |k, d|
          d.each_with_index do |c, i|
            Classification.create :name => c, :genre => Genre.find_by_name(k.to_s.capitalize)
          end 
        end
      end

      def create_levels
        Level.delete_all

        100.times do |i|
          Level.create(:level => i, :experience_required => 100*i*i)
        end
      end

    end

  end
end