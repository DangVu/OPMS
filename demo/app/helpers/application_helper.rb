module ApplicationHelper
	def show_errors(object, field_name)
  	if object.errors.any?
      if !object.errors.messages[field_name].blank?
      	object.errors.messages[field_name].join("<br/>").html_safe
      end
    end
  end
end
