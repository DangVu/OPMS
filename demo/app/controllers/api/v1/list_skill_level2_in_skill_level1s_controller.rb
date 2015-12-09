class Api::V1::ListSkillLevel2InSkillLevel1sController < Api::V1::BaseController
	def index 
		respond_with ListSkillLevel2InSkillLevel1.all
	end

	def show
		puts params
		@list = ListSkillLevel2InSkillLevel1.find_by(skillLv1Id: params[:id])
		respond_with @list
	end

	def create
		@list = ListSkillLevel2InSkillLevel1.new(list_skill2_params)
		if @list.save
			respond_with @list
		end
	end

	def update
		@list = ListSkillLevel2InSkillLevel1.find_by(:skillLv1Id)
		respond_to do |format|
			if @list.update_attributes(list_skill2_params)
				format.json { render :json => @list }
			end
		end
	end

	private
		def list_skill2_params
			params.require(:list_skill_level2_in_skill_level1).permit(:listSkillLevel2 => [:skillLv2Id, :skillLv2Name])
		end
end