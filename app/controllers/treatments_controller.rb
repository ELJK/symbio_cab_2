class TreatmentsController < ApplicationController

  before_action :signed_in_user
  before_action :correct_user, only: [:edit, :update, :destroy]

  def new
    @user = User.find(params[:id])
    if current_user.try(:admin?)
      #@user = User.find(params[:user_id])
      @new_treatment = @user.treatments.build
    else
      @new_treatment = current_user.treatments.build

    end
  end


  def create
    #@user = User.find(paUsrams[:id])
    @user = User.find(params[:user_id])
    if current_user.try(:admin?)

      @new_treatment = @user.treatments.build(treatment_params)
    else
      @new_treatment = current_user.treatments.build(treatment_params)
    end

    if @new_treatment.save
      flash[:success] = "Добавлен новый курс лечения!"
      redirect_to @user
    else
      render 'new'
    end
  end

  def edit
    #@user = User.find(params[:id])
    @treatment = Treatment.find(params[:id])
  end

  def update
    @treatment = Treatment.find(params[:id])
    @user = @treatment.user

    if @treatment.update_attributes(treatment_params)
      flash[:success] = "Изменения сохранены"
      redirect_to @user
    else
      render 'edit'
    end
  end

  def destroy
    @treatment = Treatment.find(params[:id])
    @user = @treatment.user
    @treatment.destroy

    flash[:danger] = "Курс лечения удален"
    redirect_to @user
  end

  private

  def treatment_params
    params.require(:treatment).permit(:dname, :dsurname, :dclinic, :tprog, :tdate)
  end

  # Before filters

  def correct_user
    @treatment = current_user.treatments.find_by(id: params[:id]) || current_user.try(:admin?)
    redirect_to root_url if @treatment.nil?
  end

end
