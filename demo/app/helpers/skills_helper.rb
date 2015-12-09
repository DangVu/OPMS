module SkillsHelper
	def create_list_of_skill(skill_lv2_in_lv1)
		arr = []
		skill_lv2_in_lv1.each do |skill|
			arr << {:skillLv2Id => skill.id.to_s, :skillLv2Name => skill.skill2}
		end
		arr
	end
end