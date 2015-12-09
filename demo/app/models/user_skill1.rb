class UserSkill1
  include Mongoid::Document

  field :_id, type: String
  field :skill1Id, type: String
  field :skill1Exp, type: Integer
  # field :listSkill1, type: Array
  belongs_to :user

  def as_json(options={})
  	attrs = super(options)
  	# attrs["userId"] = attrs["user_id"]
  	# attrs	
  	# super(:only => [:userId, :skill1Id, :skill1Exp])
  end
end
