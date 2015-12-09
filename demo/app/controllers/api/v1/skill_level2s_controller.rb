class Api::V1::SkillLevel2sController < Api::V1::BaseController
	def index
		respond_with SkillLevel2.all
	end

	def create
		@skill_level2 = SkillLevel2.new(skill_level2_params)
		respond_to do |format|
			if @skill_level2.save
				format.json { render :json => @skill_level2 }
			else
				format.json { render :json => show_errors(@skill_level2.errors), status: 422 }
			end
		end
	end

	def update
		@skill_level2 = SkillLevel2.find(:id)
		respond_to do |format|
			if @skill_level2.update_attributes(skill_level2_params)
				format.json { render :json => @skill_level2 }
			else
				format.json { render :json => show_errors(@skill_level2.errors) }
			end
		end
	end

	private
		def skill_level2_params
			params.require(:skill_level2).permit(:skill2, :skill_level1_id)
		end
end