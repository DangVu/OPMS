class ProjectEffort
  include Mongoid::Document

  field :_id, type: String
  field :months, type: Array
  belongs_to :project
  #----IN CASE USE PROJECT_EFFORT EMBEDDED_IN PROJECT------
  # embedded_in :project
  #--------------------------------------------------------

  def as_json(options={})
  	attrs = super(options)
  	attrs["_id"] = attrs["project_id"]
  	attrs	
  	super(:only => [:_id, :months])
  end
end
