module SessionsHelper
  
  # Logs in the given user.
  def log_in(model, user, admin)
    session[:model_id] = @model.id.to_s
    if (admin == nil) 
      session[:user_id] = @user.id.to_s
    elsif (user == nil)
      session[:admin_id] = @admin.id.to_s
    end
  end

  # Returns the current logged-in user.
  def current_model
    begin
      if session[:model_id] == session[:user_id]
        @current_model ||= User.find(session[:model_id])
      elsif session[:model_id] == session[:admin_id]
        @current_model ||= Admin.find(session[:model_id])
      end
    rescue Mongoid::Errors::DocumentNotFound
      nil
    end
  end

  # Returns true if the user is logged in, false otherwise
  def logged_in?
    return true if current_model
  end

  # Forgets a persistent session
  def forget(model)
  	cookies.delete(:model_id)
  	cookies.delete(:remember_token)
  end

  # Logs out the current user.
  def log_out
  	forget(current_model)
  	session.delete(:model_id)
  	@current_model = nil
  end
end