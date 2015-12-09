class Admin 
  include Mongoid::Document
  include ActiveModel::SecurePassword
  field :name
  field :password
  field :password_digest
  has_secure_password
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 5 }
  has_many :users
end
