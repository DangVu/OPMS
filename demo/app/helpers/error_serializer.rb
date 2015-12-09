module ErrorSerializer
	def ErrorSerializer.serialize(errors)
		return if errors.nil?

		define = {
			"Name can't be blank" => 430,
			"Password can't be blank" => 431,
			"Name is already taken" => 432, 
			"Password is too short (minimum is 6 characters)" => 433,
			"Startdate can't be blank" => 440,
			"Duedate can't be blank" => 441, 
			"Skill can't be blank" => 450,
			"Skill is already taken" => 451,
			"Skilllevel2 can't be blank" => 452,
			"Skilllevel2 is already taken" => 453
		}

		json = {}
		new_hash = errors.to_hash(true).map do |k, v|
			v.map do |msg|
				{code: k = define[msg], title: msg}
			end
		end.flatten
		json[:errors] = new_hash
		json
	end
end