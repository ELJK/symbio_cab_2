class StaticPagesController < ApplicationController

  def home
    if signed_in?
      redirect_to current_user
    else
      render 'static_pages/home'
    end
  end

  def about
  end

end
