class Api::V1::ProjectsController < Api::V1::BaseController
	include ProjectsHelper
	before_action :set_project, only: [:show, :update, :members]

	def index
		respond_with Project.order_by(:_id => 'asc')
	end

	def show
		respond_with @project
	end

	def members
		respond_with @project.members     
	end

	def new
		@project = Project.new
		@project_effort = @project.project_effort.build
	end

	def create
		@project = Project.new(project_params)
		#-------------IN CASE USE PROJECT_EFFORT EMBEDDED_IN PROJECT------------------
		# @project_effort = @project.build_project_effort( 
		# 					  :months => user_per_month(@project.startDate, @project.dueDate))
		#-----------------------------------------------------------------------------	
		respond_to do |format|
			if @project.save
				@project_effort = @project.create_project_effort(:_id => @project.id, 
							  :months => create_months(@project.startDate, @project.dueDate))	
				format.json { render json: @project }
			else
				format.json { render json: show_errors(@project.errors), status: 422 }
			end
		end
	end

	def update
		new_startDate = params[:project][:startDate].to_date
		new_dueDate = params[:project][:dueDate].to_date
		update_project_effort(@project.project_effort, new_startDate, new_dueDate)
		respond_to do |format|
			if @project.update_attributes(project_params)
				format.json {render json: @project}
			else
				format.json {render json: show_errors(@project.errors), status: 422}
			end
		end
	end

	private
		def set_project
			@project = Project.find(params[:id])
		end

		def project_params
			params.require(:project).permit(:name, :description, :startDate, :dueDate, :status, :numberOfUser)
		end
end