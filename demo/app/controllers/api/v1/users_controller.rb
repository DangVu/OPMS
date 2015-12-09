class Api::V1::UsersController < Api::V1::BaseController
	include UsersHelper
	before_action :set_user, only: [:show, :update]
	before_action :logged_in, only: [:index, :show, :create, :update]

	def index
		@users = User.all
		respond_with @users
	end

	def show
		respond_with @user
	end

	def skill_inventory
		@skill = user_info(params[:id])
		respond_with @skill 
	end

	def new
		@user = User.new 
		@user_skill1 = @user.user_skill1s.build
		@user_skill2 = @user.user_skill2s.build
	end

	def edit
	end

	def create
		@user = User.new(user_params)
		respond_to do |format|
			if @user.save
				# @user_skill1 = @user.create_user_skill1(:userId => @user.id.to_s, :listSkill1 => create_skill1_arr(params[:user][:skillInventory]))
				params[:user][:skillInventory].each do |skill1|
					@user_skill1 = @user.user_skill1s.create!( 
												:skill1Id => skill1[:skill1Id], :skill1Exp => skill1[:exp])
						skill1[:skill2s].each do |skill2|
							@user_skill2 = @user.user_skill2s.create!(:skill1Id => skill1[:skill1Id], 
								:skill2Id => skill2[:skill2Id], :skill2Exp => skill2[:exp])
						end
				end
				format.json { render json: @user, status: 200 }
			else 
				format.json { render json: show_errors(@user.errors), status: 422 }
			end
		end 
	end

	def update
		respond_to do |format|
			if @user.update_attributes(user_params)
				format.json {render json: @user}
			else
				format.json {render json: show_errors(@user.errors), status: 422}
			end
		end
	end

	def search
		first_arr = []
		Project.all.each do |value|
			if value.status == "working"
				first_arr.push(value.id) 
			end
		end		
		second_arr = []
		first_arr.each do |value1|
			Member.all.each do |value2|
				if value1 == value2.project_id
					value2.members.each do |value3|
						second_arr.push(value3[:id])
					end
				end
			end
		end
		second_arr = second_arr.uniq
		params[:searchInfo] = params[:searchInfo].merge({"id" => second_arr})
		nil_arr = []
		result_arr = params[:searchInfo].values - nil_arr
		if result_arr.empty?
			@users = User.all
		else
			@users = User.search(params[:searchInfo])
		end
		respond_to do |format|
			format.json { render json: @users }
		end
	end

	private
		def set_user
			@user = User.find(params[:id])
		end

		def user_params
			params.require(:user).permit(:name, :password, :department, :startDate, :skills => [])
		end

		def logged_in
			if !current_model
				respond_to do |format|
					format.json { render json: {:errors => "Please login to access!"}, status: 309 }
				end
			end
		end
end