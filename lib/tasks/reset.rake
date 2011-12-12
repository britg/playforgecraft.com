desc "Reset everything"

task :reset => :environment do
  Forge.delete_all
  Loot.delete_all
  Item.seed Zone.first
  Hero.all.each{ |h| h.update_attributes(:attack => Item::MIN_ATTACK, :defense => Item::MIN_DEFENSE)}
end