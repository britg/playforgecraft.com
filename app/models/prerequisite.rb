class Prerequisite < ActiveRecord::Base

  belongs_to :mine
  belongs_to :required_mine, :class_name => "Mine"

end
