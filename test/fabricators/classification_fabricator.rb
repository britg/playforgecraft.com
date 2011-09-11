Fabricator(:classification) do
  name "MyString"
  genre { Fabricate(:genre) }
end
