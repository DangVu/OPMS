class Member
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  field :members, type: Array
  belongs_to :project
  
  def user_amount
  	Rails.application.config.user_count
  end

  def as_json(options={})
  	super(:methods => [:user_amount])
	end
end
