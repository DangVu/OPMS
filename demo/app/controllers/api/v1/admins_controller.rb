class Api::V1::AdminsController < ApplicationController
	respond_to :json

	def index
		respond_with Admin.all
	end

	def show
		respond_with Admin.find(params[:id])
	end

	def new
		respond_with Admin.new 
	end

	def users
		respond_with User.all
	end

	private
		# def set_user
			# @user = User.find(params[:id])
		# end

		def admin_param
			params.require(:admin).permit(:name, :password)
		end
end