module UsersHelper
	def create_skill1_arr(skills)
		skill_arr = []
		skills.each do |skill|
			skill_arr << {:skill1Id => skill[:skill1Id], :skill1Exp => skill[:exp]}
		end
		skill_arr
	end

	def get_skill2_name(skill2Id)
		skill2 = SkillLevel2.find(skill2Id)
		skill2.skill2
	end

	def get_skill1_name(skill1Id)
		skill1 = SkillLevel1.find(skill1Id)
		skill1.skill
	end

	def user_info(userId)
		skill1s = []
		skill2s = []
		UserSkill1.where(user_id: params[:id]).each do |f|
			UserSkill2.where(user_id: params[:id], skill1Id: f.skill1Id).each do |k|
				skill2s << {skill2Id: k.skill2Id, 
										skill2: get_skill2_name(k.skill2Id), 
									  skill2Exp: k.skill2Exp}
			end
			skill1s << {skill1Id: f.skill1Id, 
									skill1: get_skill1_name(f.skill1Id),
									listSkill2: skill2s}
		end
		info = {skillInventory: skill1s}
		puts info
	end
end
