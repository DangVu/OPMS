class SkillLevel1
  include Mongoid::Document
  field :skill
  validates :skill, presence: true, uniqueness: { case_sensitive: false }
  has_many :skill_level2s
  has_one :list_skill_level2_in_skill_level1
end
