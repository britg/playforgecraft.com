Fabricator(:item) do
  name "MyString"
  description "MyText"

  genre!
  classification!
  ore!
  rarity!

  attack_min 1
  attack_max 1
  defense_min 1
  defense_max 1
  active false
end
