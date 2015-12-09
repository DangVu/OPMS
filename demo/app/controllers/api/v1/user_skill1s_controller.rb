class Api::V1::UserSkill1sController < Api::V1::BaseController
	def index
		respond_with UserSkill1.all
	end

	def new
		@user_skill1 = UserSkill1.new
	end

	def create
		@user_skill1 = UserSkill1.new(user_skill1_params)
		if @user_skill1.save
			respond_with @user_skill1
		end
	end

	private
		def user_skill1_params
			params.require(:user_skill1).permit(:skill1Id, :skill1Exp)
		end
end
