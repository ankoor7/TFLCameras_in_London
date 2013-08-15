class Camera < ActiveRecord::Base
  attr_accessible :available, :file, :lat, :lng, :location, :postcode
end
