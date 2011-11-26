require 'name_generator/data_handler'

class NameGenerator

  DATA_PATH = 'lib/name_generator/data.txt'

  class << self

    def create
      data_handler = DataHandler.new
      data_handler.read_data_file(DATA_PATH)
      name_generator = NameGenerator.new(data_handler.follower_letters)
      name_generator.generate_names(data_handler.start_pairs, 1)
    end

  end

  def initialize(follower_letters, min_length = 3, max_length = 9)
    @min_word_length = min_length
    @max_word_length = max_length
    @follower_letters = follower_letters
  end

  def generate_name(word)
    last_pair = word[-2, 2]
    letter = @follower_letters[last_pair].slice(rand(@follower_letters[last_pair].length), 1)
    if word =~ /\s$/
      return word[0, @max_word_length] unless word.length <= @min_word_length
      return generate_name(word[-1, 1]+letter)
    else
      word = word.gsub(/^\s/, '')
      return generate_name(word+letter)
    end
  end

  def generate_names(start_pairs, count = 10)
    generate_name(start_pairs[rand start_pairs.length]).capitalize
  end
end
