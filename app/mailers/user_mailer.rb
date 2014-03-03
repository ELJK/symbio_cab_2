class UserMailer < ActionMailer::Base
  default from: "Кабинет СИМБИОФАРМ <cabinet@symbiopharm.kz>"

  def registration_confirmation(user)
    @user = user
    #attachments["rails.png"] = File.read("#{Rails.root}/public/images/rails.png")
    mail(:to => "#{@user.name} #{@user.surname} <#{@user.email}>", :subject => "Благодарим вас за регистрацию")
  end

  def notification_validation(user,treatment_id,notification)
    @user = user
    @notify = notification
    @treatment_id = treatment_id
    #attachments["rails.png"] = File.read("#{Rails.root}/public/images/rails.png")
    mail(:to => "#{@user.name} #{@user.surname} <#{@user.email}>", :subject => "Активация Email оповещения")
  end

  def daily_dosage(user ,treatment, schedule)
    @user = user
    @treatment = treatment
    @schedule = schedule

    mail(:to => "#{@user.name} #{@user.surname} <#{@user.email}>", :subject => "Ваш персональный план лечения на #{Russian.strftime(@schedule.d, '%e %B %Y')} года")

  end

  def weekly_dosage(user ,treatment, schedule)
    @user = user
    @treatment = treatment
    @schedule = schedule

    mail(:to => "#{@user.name} #{@user.surname} <#{@user.email}>", :subject => "Ваш персональный план лечения на неделю с #{Russian.strftime(@schedule.first.d, '%e %B')} по #{Russian.strftime(@schedule.last.d, '%e %B %Y')} года")

  end

end

