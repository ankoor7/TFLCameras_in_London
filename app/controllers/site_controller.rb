class SiteController < ApplicationController
  def index
    @cameras = Camera.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @cameras }
    end

  end
end
