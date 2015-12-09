class Api::V1::UserSkill2sController < Api::V1::BaseController
	def index
		respond_with UserSkill2.all
	end

	def new
		@user_skill2 = UserSkill2.new
	end

	def create
		@user_skill2 = UserSkill2.new(user_skill2_params)
		if @user_skill2.save
			respond_with @user_skill2
		end
	end

	private 
		def user_skill2_params
			params.require(:user_skill2).permit(:skill1Id, :skill2Id, :skill2Exp)
		end
end
