Fabricator(:rarity) do
  name "Common"
  rank 0
end

Rarity::DEFAULTS.each_with_index do |rarity, index|
  Fabricator("#{rarity.downcase}_rarity".to_sym, :from => :rarity) do
    name rarity
    rank index
  end
end