class SkillInventory
  include Mongoid::Document

  field :userId, type: String
  field :userName, type: String
  field :listSkill, type: Array
  belongs_to :user

  def as_json(options={})
  	attrs = super(options)
  	attrs["userId"] = attrs["user_id"]
  	attrs	
  	super(:only => [:userId, :userName, :listSkill])
  end
end
