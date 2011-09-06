
module ForgeCraft
  class InitialModels
    
    class << self

      def create
        create_ores
        create_rarities
        create_genres
        create_classifications
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

    end

  end
end