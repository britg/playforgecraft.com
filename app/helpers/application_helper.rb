module ApplicationHelper

  def admin_field(obj, field, opts = {})
    
    opts = {
      :submitdata => { :single => field }, 
      :style => "inherit",
      :onblur => "ignore",
      :cssclass => "editable",
      :height => "none",
      :width => "none",
      :placeholder => "Click to edit #{field}"
    }.merge(opts)
    
    editable_field_if admin?, obj, field, opts
      
  end

  def loot(item)
    link_to(item, item_path(item), :class => item.rarity)
  end

  def loot_icon(item)
    image_tag(item.icon.url(:tiny), :title => item.type, :class => "item-icon")
  end

  def loot_with_icon(item)
    link_to "#{loot_icon(item)} #{item}".html_safe, item_path(item), :class => [item.rarity, "loot-with-icon"]
  end

  def tile_image(t)
    image_tag Ore.tile_cache(t.ore_id), 
              :class => t.to_ore, 
              "data-x" => t.x, 
              "data-y" => t.y, 
              "data-ore" => t.to_ore
  end

end
