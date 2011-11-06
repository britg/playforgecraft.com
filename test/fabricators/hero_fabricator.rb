
Fabricator(:hero_class) do
  name :warrior
end

Fabricator(:warrior, :from => :hero_class) do
  name :warrior
end

Fabricator(:thief, :from => :hero_class) do
  name :thief
end

Fabricator(:ranger, :from => :hero_class) do
  name :ranger
end

Fabricator(:hero) do
  name "MyString"
end


