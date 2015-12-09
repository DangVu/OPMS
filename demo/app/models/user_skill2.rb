class UserSkill2
  include Mongoid::Document

  field :skill1Id, type: String
  field :skill2Id, type: String
  field :skill2Exp, type: Integer
  belongs_to :user
end
