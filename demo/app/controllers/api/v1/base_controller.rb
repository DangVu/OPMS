class Api::V1::BaseController < ApplicationController
	respond_to :json
	include ErrorSerializer
	include CountUserPerMonth

	def show_errors(errors)
		ErrorSerializer.serialize(errors)
	end
end