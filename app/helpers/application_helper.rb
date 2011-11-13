module ApplicationHelper

  def selected(item)
    "selected" if (@nav_item == item)
  end

  def admin_field(obj, field, opts = {})
    
    opts = {
      :submitdata => { :single => field }, 
      :style => "inherit",
      :onblur => "ignore",
      :cssclass => "editable",
      :height => "none",
      :width => "none",
      :placeholder => "0"
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

  def player_name player
    content_tag(:span, player.name, :class => player.to_css_class)
  end

  def player_level player
    content_tag(:span, "LVL #{player.level}", :class => "level")
  end

  def player_title player
    content_tag(:span, player.title, :class => "title")
  end

  def player_slug player
    content_tag :span, :class => "player-slug" do
      [player_name(player), player_level(player), player_title(player)].join(" ").html_safe
    end
  end

  def plus_minus val
    return content_tag(:span, "+#{val.to_i.abs}", :class => "positive") if val.to_i > 0
    return content_tag(:span, "-#{val.to_i.abs}", :class => "negative") if val.to_i < 0
    content_tag(:span, "0", :class => "zero")
  end

end
