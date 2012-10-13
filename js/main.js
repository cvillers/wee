var map = null;
var oldCenter = null, center = null;

function loadPlaces() {
	oldCenter = center;
	center = map.getCenter();
	
	// if we didn't move far, don't bother loading new places
	if(google.maps.geometry.spherical.computeDistanceBetween(oldCenter, center) > 115) {
		
		$("div#map_canvas").spin({
			lines : 17, // The number of lines to draw
			length : 21, // The length of each line
			width : 5, // The line thickness
			radius : 30, // The radius of the inner circle
			corners : 1, // Corner roundness (0..1)
			rotate : 0, // The rotation offset
			color : '#000', // #rgb or #rrggbb
			speed : 1, // Rounds per second
			trail : 60, // Afterglow percentage
			shadow : false, // Whether to render a shadow
			hwaccel : false, // Whether to use hardware acceleration
			className : 'spinner', // The CSS class to assign to the spinner
			zIndex : 2e9, // The z-index (defaults to 2000000000)
			top : 'auto', // Top position relative to parent in px
			left : 'auto' // Left position relative to parent in px
		});
	
		// compute the new search radius
		var bounds = map.getBounds();
		
		var radius = google.maps.geometry.spherical.computeDistanceBetween(bounds.getSouthWest(), bounds.getNorthEast());

		// category id is fixed for now
		var query = "venues/search?ll=LATLONG&categoryId=4d4b7105d754a06374d81259&radius=RAD&intent=browse";
		query = query.replace(/LATLONG/, center.toUrlValue()).replace(/RAD/, Math.ceil(radius).toString());
		
		//alert(radius);
		$("div#debug-out").html(query + "<br />" + center.toUrlValue());
		
		$("div#map_canvas").spin(false);
	
	}
}

function createMap(latitude, longitude) {
	var mapOptions = {
		center : new google.maps.LatLng(latitude, longitude),
		zoom : 12,
		mapTypeId : google.maps.MapTypeId.HYBRID
	};
		
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	
	center = map.getCenter();
	
	google.maps.event.addListener(map, 'center_changed', function() {
		loadPlaces();
	});
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

	//loadPlaces();
});