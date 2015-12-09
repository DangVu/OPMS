module ProjectsHelper
	include CountUserPerMonth

	def create_months(startDate, dueDate)
		months_arr = []
		userInMonth = []
		months_arr = create_months_array(startDate, dueDate)
		userInMonth = create_object_in_months(months_arr)
		userInMonth
	end

	def create_object_in_months(months_arr)
		userInMonth = []
		months_arr.each do |month|
			userInMonth << { :month => month, :numberOfUser => 0, :userId => [] }
		end
		userInMonth
	end

	def update_project_effort(project_effort, startDate, dueDate)
		old_months_array = []
		new_months_array = []
		add_array = []
		remove_array = []
		project_effort.months.each do |f|
			old_months_array << f["month"]
		end
		new_months_array = create_months_array(startDate, dueDate)
		add_array = new_months_array - old_months_array
		remove_array = old_months_array - new_months_array
		remove_array.each do |remove_value|
			ProjectEffort.where(id: project_effort.id).update(
				{'$pull' => {months: {month: remove_value}}})
		end
		ProjectEffort.where(id: project_effort.id).update(
			{'$push' => {months: {'$each' => create_object_in_months(add_array)}}})
	end
end