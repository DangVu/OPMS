class Api::V1::ProjectEffortsController < Api::V1::BaseController
	def index
		respond_with ProjectEffort.order_by(:_id => 'asc')
	end

	def new
	end

	def create
		@project_effort = ProjectEffort.new(project_effort_params)
		if @project_effort.save
			respond_with @project_effort
		end 
	end

	def update
		@project_effort = ProjectEffort.find_by(params[:_id])
		if @project_effort.update_attributes(project_effort_params)
			respond_with @project_effort
		end
	end

	def show_user_in_month
		puts "*****************"
		userId_arr = []
		project_effort = ProjectEffort.find(params[:id])
		project_effort.months.each do |f|
			if f[:month] == params[:month]
				userId_arr = f[:userId]
			end
		end
		user_in_month_arr = []
		mems = []
		mems << Member.where(project_id: params[:id])
		mems.each do |mem|
			mem.each do |f|
				user_in_month_arr << f.members
			end
		end
		puts user_in_month_arr.flatten.inspect
		user_in_month_arr = user_in_month_arr.flatten
		puts "*****************"
		respond_to do |format|
			format.json {render json: user_in_month_arr}
		end
	end

	private
		def project_effort_params
			params.require(:project_effort).permit(:months => [:month, :numberOfUser, :userId => []])
		end
end