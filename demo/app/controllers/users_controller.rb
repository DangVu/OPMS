class UsersController < ApplicationController
	# before_action :admin_logged_in, only: [:show, :new, :edit, :index, :create]
	respond_to :json

  def index
  	@users = User.all
  end

  def show
  	@user = User.find(params[:id])
  end

  def new
  	@user = User.new
  end

  def create
		puts params[:user] 
		@user = User.new(user_param)
		respond_to do |format|
			if @user.save
				# format.html { redirect_to @user, notice: 'Successfull created' }
				format.json { render :show, status: :created, location: @user }
			else 
				# format.html { render :new }
				format.json { render json: ErrorSerializer.serialize(@user.errors), status: :unprocessable_entity }
			end
		end 
	end

  # def create
  # 	# puts params["user"]["name"]
  # 	@user = User.new(user_params)
  # 	if @user.save
  # 		respond_to do |format|
  # 			format.html {redirect_to api_v1_users_path}
  # 			format.json {render json: @user, status: 201}
  # 		end
  # 		# puts "success"
  # 	else
  # 		respond_to do |format|
  # 			# if @user.errors.full_messages === "Name can't be blank"
  # 			# format.html {render :new}
  # 			format.json {render json: @user.errors, status: :unprocessable_entity}
  # 		end
  # 	end
  # end

  private
		# def set_user
			# @user = User.find(params[:id])
		# end

		def user_param
			params.require(:user).permit(:name, :password, :department)
		end

		# def user_params
		# 	# params.require(:user).permit(:name, :password, :department)
		# 	params.require("user").permit("name", "password", "department")
		# end

		def admin_logged_in
			# unless logged_in_admin? || logged_in_user?
			# 	flash[:danger] = "Please login"
			# 	redirect_to login_path
			# end
			if !current_admin
				flash[:danger] = "Please login"
				redirect_to login_path
			end
		end

		# def user_logged_in
		# 	unless logged_in_user?
		# 		flash[:danger] = "Please login"
		# 		redirect_to login_path
		# 	end
		# end
end
