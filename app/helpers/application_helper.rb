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

  def tile_image(t)
    image_tag Ore.tile_cache(t.ore_id), 
              :class => t.to_ore, 
              "data-x" => t.x, 
              "data-y" => t.y, 
              "data-ore" => t.to_ore
  end

end
