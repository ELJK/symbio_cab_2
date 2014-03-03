class NotificationsController < ApplicationController

  before_action :signed_in_user
  before_action :correct_user, only: [:edit, :update, :destroy]

  def new
    @user = User.find(params[:user_id])
    if current_user.try(:admin?)

      @treatment = @user.treatments.find(params[:treatment_id])
      @notify = @treatment.build_notification
    else
      @notify = current_user.treatments.find(params[:treatment_id]).build_notification
    end

  end

  def create
    @user = User.find(params[:user_id])
    if current_user.try(:admin?)

      @treatment = @user.treatments.find(params[:treatment_id])
      @notify = @treatment.build_notification(notification_params)
    else

      @notify = current_user.treatments.find(params[:treatment_id]).build_notification(notification_params)
    end

    if @notify.save
      UserMailer.notification_validation(@user,params[:treatment_id],@notify).deliver
      flash[:success] = "Напоминание создано. На указанный email адрес был выслан запрос о подтверждении."
      redirect_to @user
    else
      render 'new'
    end

  end

  def edit

    @treatment = Treatment.find(params[:treatment_id])
    @notify = @treatment.notification

  end

  def update

    @treatment = Treatment.find(params[:treatment_id])
    @notify = @treatment.notification
    @user = @notify.treatment.user

    if @notify.update_attributes(notification_params)
      flash[:success] = "Изменения сохранены"
      redirect_to @user
    else
      render 'edit'
    end

  end

  def destroy
    @notify = Treatment.find(params[:treatment_id]).notification
    @user = @notify.treatment.user
    @notify.destroy

    flash[:danger] = "Напоминания удалены"
    redirect_to @user
  end

  def confirm
    @treatment = Treatment.find(params[:treatment_id])
    @ecode = @treatment.notification.econfirmation_code

    if @ecode == params[:econfirmation_code]

      @treatment.notification.econfirmed = true
      @treatment.notification.econfirmation_code = nil
      @treatment.notification.save

      flash[:success] = "Ваши напоминания успешно активированы"
      redirect_to current_user

    else

      flash[:danger] = "Ошибка. Пожалуйста попробуйте снова"
      redirect_to current_user

    end

  end

  private

  def notification_params
    params.require(:notification).permit(:email, :eactive, :eregime, :phone, :pactive, :pregime)
  end

  # Before filters

  def correct_user
    @notify = current_user.treatments.find_by(id: params[:treatment_id]) || current_user.try(:admin?)
    redirect_to root_url if @notify.nil?
  end

end
