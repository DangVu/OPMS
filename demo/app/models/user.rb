class User
  include Mongoid::Document
  include ActiveModel::SecurePassword
  field :name
  field :password_digest
  has_secure_password
  field :department
  field :skills, type: Array
  field :startDate, type: Date
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 6 }, allow_blank: true
  validates :department, presence: true
  validates :startDate, presence: true
  has_one :skill_inventory
  has_many :user_skill1s
  has_many :user_skill2s

  def self.search(search)
    time_arr = User.date_cal(search[:exp])
    search = search.merge({"exp" => time_arr})
    if search
      any_of({name: /#{search[:name]}/, 
              department: /#{search[:department]}/, 
              skills: /\b#{search[:skills]}\b/, 
              startDate: {"$lt" => search[:exp].at(0), "$gte" => search[:exp].at(1)}#, 
              # :_id.in => search[:id] 
              })
    end
  end

  private
    def self.date_cal(date)
      current_time = Time.now.to_date
      year_arr = date.split(' - ')
      from_date = current_time.prev_year(year_arr.at(0).to_i)
      if year_arr.at(1).nil?
        to_date = current_time.prev_year(current_time.year)
      else
        to_date = current_time.prev_year(year_arr.at(1).to_i)
      end
      time_arr = ["#{from_date}", "#{to_date}"]
    end
end
