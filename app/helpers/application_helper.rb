module ApplicationHelper

  def timeago(time, options = {})
    options[:class] ||= "timeago"
    content_tag(:abbr, time.to_s, options.merge(:title => time.getutc.iso8601)) if time
  end

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

  def loot_icon(loot)
    image_tag(loot.icon, :class => "item-icon")
  end

  def loot_with_icon(loot)
    link_to "#{loot_icon(loot)} #{loot}".html_safe, "#", :class => [loot.rarity, "loot-with-icon", "launch-equipper"], "data-id" => loot.to_param, "data-external" => true
  end

  def equipment_icon(loot)
    image_tag(loot.icon, :class => "loot-icon", :"data-id" => loot.id, :"data-type" => loot.to_css_classes, :"data-attack" => loot.attack, :"data-defense" => loot.defense, :"data-tip" => loot.tip)
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

  def player_zone player
    content_tag(:span, player.zone, :class => "title")
  end

  def player_slug player
    content_tag :span, :class => "player-slug" do
      [player_name(player)].join(" ").html_safe
    end
  end

  def plus_minus val
    return content_tag(:span, "+#{val.to_i.abs}", :class => "positive") if val.to_i > 0
    return content_tag(:span, "-#{val.to_i.abs}", :class => "negative") if val.to_i < 0
    content_tag(:span, "0", :class => "zero")
  end

  def map_link text, image_width=20
    content_tag(:span, link_to(text, map_index_path), :class => "map-link")
  end

  def action_button forge
    if current_player.try(:can_forge_at?, forge)
      return link_to "Forge", forge_path(forge), :class => "btn primary"
    elsif current_player == forge.player
      return link_to "Review", forge_path(forge), :class => "btn primary review"
    end
  end

end
