require 'open-uri'

def reset_cameras
  Camera.delete_all
end


namespace :tfl_apis do
  desc "fetching tfl camera api and saving data into camera table"
  task :cameras => :environment do
    url = 'http://www.tfl.gov.uk/tfl/livetravelnews/trafficcams/cctv/jamcams-camera-list.xml'
    doc = Nokogiri::XML(open(url))
    reset_cameras
    doc.xpath("//syndicatedFeed/cameraList/camera").each do |camera|
      attributes = {
        available: camera.attribute("available").to_s,
        file: camera.xpath("file").text,
        lat: camera.xpath("lat").text,
        lng: camera.xpath("lng").text,
        postcode: camera.xpath("postCode").text,
        location: camera.xpath("location").text
      }
      Camera.create(attributes)
    end
  end

end
