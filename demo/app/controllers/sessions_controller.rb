class SessionsController < ApplicationController
  respond_to :json
	def new
	end

  def find_model
    @username = params[:session][:name].downcase
    @password = params[:session][:password]
    if params[:session][:type] == "user"
      @model = User.find_by(name: @username)
      @user = @model
    elsif params[:session][:type] == "admin"
      @model = Admin.find_by(name: @username)
      @admin = @model
    end
  end

	def create
    find_model
    respond_to do |format|
      if @model == nil
        format.json {render json: {:error => "no User"}, status: 450}
      elsif @model && @model.authenticate(@password)
        log_in(@model, @user, @admin)
        format.json {render json: User.all, status: 202}
      elsif @model[:password] != @password
        format.json {render json: {:error => "Wrong password"}, status: 451}
      end
    end
  end

  def destroy
  	log_out if logged_in?
		redirect_to root_path
  end
end
