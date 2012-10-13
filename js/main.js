function loadPlaces() {
	
}

function createMap(latitude, longitude) {
	var mapOptions = {
		center : new google.maps.LatLng(latitude, longitude),
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.HYBRID
	};
		
	var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

/* spin.js options
var opts = {
  lines: 17, // The number of lines to draw
  length: 21, // The length of each line
  width: 5, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  color: '#000', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
 */

$(document).ready(function() {
	var center = null;

	if(!navigator.geolocation) {
		createMap(40.754781, -73.978532);
	} else {
		navigator.geolocation.getCurrentPosition(
			function(pos) {
				createMap(pos.coords.latitude, pos.coords.longitude);
			},
			function(error) {
				alert("there was an error");
			},
			{
				enableHighAccuracy: false,
				timeout: 15,
				maximumAge: 3600000		// 1 hour
			}
		);
	}

	loadPlaces();
});