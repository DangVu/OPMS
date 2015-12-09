class Api::V1::MembersController < Api::V1::BaseController

  def index
    @members = Member.all
    respond_with @members
  end

  def show
    respond_with Member.find(params[:id])
  end

  def edit
  end

  def new
    @member = Member.new
  end

  def create
    @member = Member.new(member_params)
    respond_to do |format|
      if @member.save
        format.json { render :json => @member }
        user_count(params[:member][:project_id])
        user_per_month(@member, "", "create")
      else
        format.json { render json: @member.errors, status: 422 }
      end
    end
  end

  def update
    @member = Member.find_by(_id: "#{params[:id]}")
    @member.members.each do |f|
      f.values.each do |k|
        if k == "#{params[:member][:userID]}"
          user_per_month(@member, params[:member][:userID], "delete")
          f["role"].clear
          f["role"].concat(params[:member][:role])
          f["language"].clear
          f["language"].concat(params[:member][:language])
          f["dueDate"] = params[:member][:dueDate]
          @member.save
          user_per_month(@member, params[:member][:userID], "create")
        end
      end
    end
    respond_to do |format|
      format.json { render :json => @member }
    end
  end

  def destroy
    @member = Member.find_by(_id: "#{params[:member][:memberID]}")
    @member.members.each do |f|
      if f["id"] == "#{params[:id]}"
        user_per_month(@member, params[:id], "delete")
        @member.members.delete_if {|a| a == f}         
        @member.save
        if @member.members == []
          @member.destroy
        end
      end
    end 
    user_count(@member.project_id)
    respond_to do |format|
      format.json { render :json => @member }
    end
  end

  private
    def member_params
      params.require(:member).permit(:project_id,
       :members => [:id, :name, :startDate,
         :dueDate, :effort, :language => [], :role => []])
    end
end
