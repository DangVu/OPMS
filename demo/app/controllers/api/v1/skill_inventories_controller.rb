class Api::V1::SkillInventoriesController < Api::V1::BaseController
	def index
		respond_with SkillInventory.all
	end

	def create
		@skill_inventory = SkillInventory.new(skill_inventory_params)
		if @skill_inventory.save
			respond_with @skill_inventory
		end
	end

	private
		def skill_inventory_params
			params.require(:skill_inventory).permit(:userId, :userName, :listSkill => [:language, :exp])
		end
end