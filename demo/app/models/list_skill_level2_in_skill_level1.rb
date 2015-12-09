class ListSkillLevel2InSkillLevel1
  include Mongoid::Document

  field :skillLv1Id, type: String
  field :skillLv1, type: String
  field :listSkillLevel2, type: Array 
  belongs_to :skill_level1

  def as_json(options={})
  	attrs = super(options)
  	attrs["skillLv1Id"] = attrs["skill_level1_id"]
  	attrs	
  	super(:only => [:skillLv1Id, :skillLv1, :listSkillLevel2])
  end
end
