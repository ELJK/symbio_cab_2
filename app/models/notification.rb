class Notification < ActiveRecord::Base
  belongs_to :treatment

  before_save { self.email = email.downcase }
  before_create :create_ecode

  validates :treatment_id, presence: true

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence:   true,
            format:     { with: VALID_EMAIL_REGEX }

  validates_inclusion_of :eactive, in: [true, false]
  validates :eregime, presence: true
  #validates :econfirmation_code, presence: true
  validates_inclusion_of :econfirmed, in: [true, false]

  #validates :phone, presence: true
  #validates_inclusion_of :pactive, in: [true, false]
  #validates :pregime, presence: true

  def Notification.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  def Notification.new_remember_token
    SecureRandom.urlsafe_base64
  end

  private

    def create_ecode

      self.econfirmation_code = Notification.encrypt(Notification.new_remember_token)
      #self.econfirmed = false

    end

end
