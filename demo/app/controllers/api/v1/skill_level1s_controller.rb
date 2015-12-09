class Api::V1::SkillLevel1sController < Api::V1::BaseController
	include SkillsHelper
	before_action :set_skill_level1, only: [:skill_level2s, :update]
	def index
		respond_with SkillLevel1.all
	end

	def skill_level2s
		respond_with @skill_level1.skill_level2s
	end

	def new
		@skill_level1 = SkillLevel1.new
		@skill_level2 = @skill_level1.skill_level2s.build
		@list = @skill_level1.list_skill_level2_in_skill_level1.build
	end

	def create
		@skill_level1 = SkillLevel1.new(skill_level1_params)
		listSkillLevel2 = []
		respond_to do |format|
			if @skill_level1.save
				params[:skill_level1][:skill_level2s].each do |skill_level2|
					@skill_level2 = @skill_level1.skill_level2s.create!(:skill_level1_id => @skill_level1.id, 
						:skill2 => skill_level2)
				end
				listSkillLevel2 = create_list_of_skill(@skill_level1.skill_level2s)
				@list = @skill_level1.create_list_skill_level2_in_skill_level1(:skillLv1Id => @skill_level1.id,
				 :skillLv1 => @skill_level1.skill, :listSkillLevel2 => listSkillLevel2)
				format.json { render json: @skill_level1 }
			else
				format.json { render json: show_errors(@skill_level1.errors), status: 422 }
			end
		end
	end

	def update
		newListSkillLevel2 = []
		respond_to do |format|
			if @skill_level1.update_attributes(skill_level1_params)
				SkillLevel2.where(skill_level1_id: params[:id]).delete_all
				params[:skill_level1][:skill_level2s].each do |skill_level2|
					@skill_level2 = @skill_level1.skill_level2s.create!(:skill_level1_id => @skill_level1.id, 
						:skill2 => skill_level2)
					newListSkillLevel2 = create_list_of_skill(@skill_level1.skill_level2s)
					puts newListSkillLevel2
					ListSkillLevel2InSkillLevel1.where(skillLv1Id: params[:id]).update({'$set' => {listSkillLevel2: newListSkillLevel2}})
				end
				format.json { render json: @skill_level1 }
			else
				format.json { render json: show_errors(@skill_level1.errors), status: 422 }
			end
		end
	end

	private
		def set_skill_level1
			@skill_level1 = SkillLevel1.find(params[:id])
		end

		def skill_level1_params
			params.require(:skill_level1).permit(:skill)
		end
end
