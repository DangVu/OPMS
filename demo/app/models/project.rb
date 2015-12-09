class Project
  include Mongoid::Document
  
  field :name
  field :description
  field :startDate, type: Date
  field :dueDate, type: Date
  field :status	
  field :numberOfUser, type: Integer
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :startDate, presence: true
  validates :dueDate, presence: true
  has_many :members
  has_one :project_effort
  #----IN CASE USE PROJECT_EFFORT EMBEDDED_IN PROJECT------
  # embeds_one :project_effort
  #--------------------------------------------------------
end