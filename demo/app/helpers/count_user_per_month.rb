module CountUserPerMonth

	def create_months_array(startDate, dueDate)
		months_arr = []
		(startDate..dueDate).each do |date|
				months_arr << "#{date.month}#{date.year}"
		end
		months_arr = months_arr.uniq
	end

	def user_count(projectID)
    mem = []
    userID_arr = []
    project = Project.find(projectID)
    Member.all.each do |value|
      if value.project_id.to_s == projectID.to_s
         mem << value.members
      end
    end
    mem.each do |value1|
      value1.each do |value2|
        userID_arr << value2["id"]
      end                                                                                                                                                                                                                                                                                                                                                        
    end
    # Rails.application.config.user_count = userID_arr.count
    @count = userID_arr.count
    project.update_attribute(:numberOfUser, @count)
	end

	def get_months(members, projectID, userID, status)
		months_arr = []
		compare_month_arr = []
		if userID.empty? && status == "create"
			startDate = members[0]["startDate"].to_date
			dueDate = members[0]["dueDate"].to_date
		elsif userID.empty? == false && status == "delete" 
			current_time = Time.now.to_date
			members.each do |f|
				if f["id"] == userID
					if current_time >= f["startDate"].to_date && current_time <= f["dueDate"].to_date
						startDate = current_time
						dueDate = f["dueDate"].to_date
					else
 						startDate = f["startDate"].to_date
						dueDate = f["dueDate"].to_date
					end
				end 
			end
		elsif userID.empty? == false && status == "create"
			startDate = members[0]["startDate"].to_date
			members.each do |f|
				if f["id"] == userID
					dueDate = f["dueDate"].to_date
				end
			end
		end
		months_arr = create_months_array(startDate, dueDate)
		project_effort = ProjectEffort.find(projectID)
		project_effort.months.each do |value|
			compare_month_arr << value["month"]
		end
		result = compare_month_arr & months_arr
	end

	def get_inc_value(members, userID, status)
		current_time = Time.now.to_date
		if userID.empty? && status == "create"
			inc_value = members.count
		elsif userID.empty? == false && status == "delete"
			members.each do |f|
				if userID == f["id"]
					if current_time >= f["startDate"].to_date && current_time >= f["dueDate"].to_date
						inc_value = 0
					else
						inc_value = -1
					end
				end
			end
		elsif userID.empty? == false && status == "create"
			inc_value = 1
		end
		inc_value
	end

	def add_or_delete_user_id(result, members, userID, projectID, status)
		project_effort = ProjectEffort.find(projectID)
		current_time = Time.now.to_date
		result.each do |value|
			if userID.empty? == true && status == "create"
				members.each do |member|
					ProjectEffort.where(_id: projectID, 
						months: {'$elemMatch' => {month: value}}).update('$push' => {'months.$.userId' => member[:id]})
				end
			elsif userID.empty? == false && status == "delete"
				members.each do |f|
					if userID == f["id"]
						if current_time >= f["startDate"].to_date && current_time >= f["dueDate"].to_date
							project_effort.save
						else
							project_effort.months.each do |month|
								if month[:month] == value
									month[:userId].delete_if{ |id| id == userID }
								end
							end
							project_effort.save
						end
					end
				end
			elsif userID.empty? == false && status == "create"
				ProjectEffort.where(_id: projectID, 
					months: {'$elemMatch' => {month: value}}).update('$push' => {'months.$.userId' => userID})
			end
		end
	end

	def user_per_month(member, userID, status)
		members = member.members
		projectID = member.project_id
		project_effort = ProjectEffort.find(projectID)
		inc_value = get_inc_value(members, userID, status)
		result = get_months(members, projectID, userID, status)
		add_or_delete_user_id(result, members, userID, projectID, status)
		result.each do |value|
			ProjectEffort.where(_id: projectID, 
				months: {'$elemMatch' => {month: value}}).update({'$inc' => {'months.$.numberOfUser' => inc_value}})
		end

	#--------------------IN CASE USE PROJECT_EFFORT EMBEDDED_IN PROJECT----------------------------------
		# project = Project.find(projectID)
		# project.project_effort.months.each do |value|
		# 	compare_month_arr << value["month"]
		# end
		# result = compare_month_arr & months_arr
		# result.each do |value|
		# 	Project.where(_id: projectID, 'project_effort.$.months.$.month' => value).update({'$inc' => {'project_effort.months.$.numberOfUser' => inc_value}})
		# end
	#----------------------------------------------------------------------------------------------------
	end
end
