module ApplicationHelper

  def admin_field(obj, field)
    editable_field_if admin?, obj, field, 
      :submitdata => { :single => field }, 
      :style => "inherit"
  end

end
