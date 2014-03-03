class User < ActiveRecord::Base
  has_many :treatments, dependent: :destroy
  accepts_nested_attributes_for :treatments, allow_destroy: true

  before_save { self.email = email.downcase }
  before_create :create_remember_token

  validates :name, presence: true, length: { maximum: 50 }
  validates :surname, presence: true, length: { maximum: 50 }
  validates :gender, presence: true
  validates :dob, presence: true

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence:   true,
            format:     { with: VALID_EMAIL_REGEX },
            uniqueness: { case_sensitive: false }

  has_secure_password
  validates :password, length: { minimum: 6 }

  def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  def list
    treatments
  end

  def self.daily_dosage
    @user = User.all
    @user.each do |u|
      @treatment = u.treatments
      @treatment.each do |t|
        unless t.notification.nil?
          if t.notification.econfirmed == true
            if t.notification.eactive == true
              if t.notification.eregime == "Ежедневно"
                if ((t.tph0_s..t.tph2_e).cover?(Date.today))
                  @schedule = t.schedules.where(d: Date.today).first
                  UserMailer.daily_dosage(u,t,@schedule).deliver
                end
              end
            end
          end
        end
      end
    end
  end

  def self.weekly_dosage
    @user = User.all
    @user.each do |u|
      @treatment = u.treatments
      @treatment.each do |t|
        unless t.notification.nil?
          if t.notification.econfirmed == true
            if t.notification.eactive == true
              if t.notification.eregime == "Еженедельно"
                if ((t.tph0_s..t.tph2_e).cover?(Date.today))

                  date = Date.today
                  @sch = Array.new
                  while date <= [(Date.today + 6.days), t.tph2_e].min

                    schedule = t.schedules.where(d: date).first
                    @sch.push schedule


                  date += 1.day
                  end
                end
                puts @sch.first.d
                UserMailer.weekly_dosage(u,t,@sch).deliver
              end
            end
          end
        end
      end
    end
  end

  private

  def create_remember_token
    self.remember_token = User.encrypt(User.new_remember_token)
  end

end