Fabricator(:genre) do
  name "Weapon"
end

Fabricator(:weapon_genre, :from => :genre) do
  name "Weapon"
end

Fabricator(:armor_genre, :from => :genre) do
  name "Armor"
end
