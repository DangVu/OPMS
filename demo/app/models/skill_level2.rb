class SkillLevel2
  include Mongoid::Document
  
  field :skill2
  # field :exp
  validates :skill2, presence: true, uniqueness: { case_sensitive: false }
  belongs_to :skill_level1
end
