$(function(){
  var mapOptions,
  canvas,
  map,
  initialBounds,
  present_cameras = [],
  new_cameras;

  // create an options hash
  mapOptions = {
    zoom:14,
    center:new google.maps.LatLng(51.508742, -0.120850),
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };

  //grab our DOM element "googleMap" an assign it to the canvas variable
  canvas = document.getElementById("googleMap");

  //create a new map, passing the canvas and mapOptions as arguments.
  map = new google.maps.Map(canvas, mapOptions);
  var cameras
  var markers = []
  $.getJSON('/site/index.json', parse_cameras)
  function parse_cameras(cameras_list) {
    cameras = _.shuffle(cameras_list);
  };

  // Make a content window
  var infowindow = new google.maps.InfoWindow({
    content: '',
  });

  // Add a listener to update after the user moves the map
  google.maps.event.addListener(map, 'idle', function() {
        try {
          // Get the cameras within the bounds of the map
          visible_cameras = _.filter(cameras, function(camera){
            // Get Lat and Lng bounds of the map
            initialBounds = map.getBounds();

            // Evaluates to true or false if the camera is in the map boundary
            return (map.getBounds().contains((new google.maps.LatLng( camera.lat, camera.lng)))) ;
            // initialBounds.contains(latLng: latlng_object);
          });
          // Find the cameras within the view and put them into cameras object
          // visible_cameras = cameras
          console.log("visible_cameras");
          console.log(visible_cameras);

          // find the extra cameras to add to the map
          new_cameras = _.difference(visible_cameras, present_cameras);
          console.log("new_cameras");
          console.log(new_cameras);
          console.log("present_cameras");
          console.log(present_cameras);

          // Place the visible cameras on the map
          set_point_placements(new_cameras);

          // Record the new cameras in the present cameras variable;
          present_cameras = present_cameras.concat(new_cameras);
          console.log("present_cameras");
          console.log(present_cameras);

        } catch( err ) {
            console.log( err );
        }
    });


  function set_point_placements(cameras) {
      for (var i = 0; i < cameras.length; i++) {
      (function(index){
        setTimeout( function(){ put_points(index, cameras); }, index*25);
      })(i);
    };
  }


  // Set Map markers and put into Google Map
  function put_points(i, cameras){
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(cameras[i].lat,cameras[i].lng),
      map: map,
      title: cameras[i].location,
      camera_id: i,
      animation: google.maps.Animation.DROP
    });

    // add marker to markers array - May be useless
    markers[i] = marker;

    // Create event for the marker
    google.maps.event.addListener(markers[i], 'click', function() {
      camera = cameras[this.camera_id];

      // construct the infowindow content
      image = '<img src="http://www.tfl.gov.uk/tfl/livetravelnews/trafficcams/cctv/' + camera.file + '" >';
      infowindow.content = '<div class="popup_content"><p>' + camera.location + ', ' + camera.postcode  + '</p>' + image + '</div>';
      // open the infowindow
      infowindow.open(map,markers[this.camera_id]);
    });
  };

});