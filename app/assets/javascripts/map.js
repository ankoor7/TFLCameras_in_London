$(function(){
  var mapOptions,
  canvas,
  map;

  // create an options hash
  mapOptions = {
    zoom:12,
    center:new google.maps.LatLng(51.508742, -0.120850),
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };

  //grab our DOM element "googleMap" an assign it to the canvas variable
  canvas = document.getElementById("googleMap");

  //create a new map, passing the canvas and mapOptions as arguments.
  map = new google.maps.Map(canvas, mapOptions);
  var cameras
  var markers = []
  $.getJSON('http://localhost:3000/site/index.json', parse_cameras)
  function parse_cameras(cameras_list) {
    cameras = _.shuffle(cameras_list);
    for (var i = 0; i < cameras.length; i++) {
      (function(index){
        setTimeout(function(){put_points(index, cameras);}, index*25);
      })(i);
  };
};

// Make a content window
var infowindow = new google.maps.InfoWindow({
  content: '',
});


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