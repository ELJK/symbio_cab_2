class UsersController < ApplicationController
  before_action :signed_in_user, only: [:show, :edit, :update]
  before_action :correct_user,   only: [:show, :edit, :update]
  before_action :admin_user, only: [:destroy, :admin]

  def new
    if signed_in?
      redirect_to current_user
    else
      @user = User.new
      @user.treatments.build
      #@user.treatments.notifications.build

    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      sign_in @user
      flash[:success] = "Регистрация прошла успешно! Добро пожаловать!"
      redirect_to @user
      UserMailer.registration_confirmation(@user).deliver
    else
      render 'new'
    end
  end

  def edit
    @user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = "Изменения сохранены"
      redirect_to @user
    else
      render 'edit'
    end
  end

  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "Пользователь удален"
    redirect_to admin_url
  end

  def show
    @user = User.find(params[:id])
    @treatments = @user.treatments.all

    @schedule = Array.new
    @notification = Array.new

    counter = 0;
    @treatments.each do |treatment|
      @schedule[counter] = @user.treatments.find(treatment.id).schedules.all
      @notification[counter] = @user.treatments.find(treatment.id).notification
      counter += 1
    end

    #@treatments = Treatment.find()
    @new_treatment = current_user.treatments.build
  end

  def admin
    if current_user.admin? && !current_user?(@user)
      @users = User.paginate(page: params[:page])
    else
      redirect_to(root_url)
    end
  end

  private

    def user_params
      params.require(:user).permit(:name, :surname, :gender, :dob, :email, :tel, :password,
                                 :password_confirmation,
                                 treatments_attributes: [:id, :dname, :dsurname, :dclinic, :tprog, :tdate])
    end

  # Before filters

    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_url) unless current_user?(@user) || current_user.try(:admin?)
    end

    def admin_user
      redirect_to(root_url) unless current_user.try(:admin?)
    end

end
