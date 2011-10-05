Fabricator(:action) do
  turn 1
  action :swap_tiles
  game!
  player!
end
