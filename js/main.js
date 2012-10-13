var map = null, heatmap = null;
var oldCenter = null, center = null;
var oldZoom = null, zoom = null;
var markers = [];
var infoWindows = [];

var token = "CLIENT-TOKEN";
var apiUrl = "https://api.foursquare.com/";
var fsqLoadTimeout = null;

function makeRequest(query, callback) {
  var query = query + ((query.indexOf('?') > -1) ? '&' : '?') + 'oauth_token=' + token + '&v=20121013&callback=?';
  $.getJSON(apiUrl + 'v2/' + query, {}, callback);
};

function loadPlaces(force) {
	oldCenter = center;
	center = map.getCenter();
	oldZoom = zoom;
	zoom = map.getZoom();

	var distance = google.maps.geometry.spherical.computeDistanceBetween(
			oldCenter, center);

	// if we didn't move far, don't bother loading new places
	if ((distance > 300 && map.getZoom() >= 11)
			|| (distance <= 30 && Math.abs(oldZoom - zoom) > 2) || force) {

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

		var radius = google.maps.geometry.spherical.computeDistanceBetween(
				bounds.getSouthWest(), bounds.getNorthEast());

		if (radius <= 7500) {
			heatmap.setMap(null);
			markers.forEach(function(m) { m.map = null; });
			markers = [];

			// category id is fixed for now
			var query = "venues/search?ll=LATLONG&categoryId=4d4b7105d754a06374d81259&radius=RAD&intent=browse";
			query = query.replace(/LATLONG/, center.toUrlValue()).replace(
					/RAD/, Math.ceil(radius).toString());

			// $("div#debug-out").html(Math.ceil(radius).toString() + "<br />" +
			// center.toUrlValue());

			// load from foursquare
			makeRequest(query, function(response) {
				var venues = response["response"]["venues"];
				// alert(venues.length);
				var hmData = [];
				venues.forEach(function(v) {
					hmData.push({
						location: new google.maps.LatLng(v.location.lat, v.location.lng),
						weight: v.stats.checkinsCount == 0 ? 1 : v.stats.checkinsCount
					});

					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(v.location.lat, v.location.lng),
						map: map
						//title: v.name,
						//visible: true
					});
					
					var infoWindow = new google.maps.InfoWindow({
							content: 	"<h3>" + v.name + "</h3>" + 
										"<p>" + v.stats.checkinsCount + " checkins from " + v.stats.usersCount + " people</p>"
					});
					infoWindows.push(infoWindow);
					
					google.maps.event.addListener(marker, 'click', function() {
						infoWindows.forEach(function(i) { i.close(); });
						infoWindow.open(map, marker);
					});

					markers.push(marker);
				});
				var heatmap = new google.maps.visualization.HeatmapLayer({
					data: hmData
				});
				heatmap.setData(hmData);
				heatmap.setMap(map);
			});
		}

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
	zoom = map.getZoom();

	heatmap = new google.maps.visualization.HeatmapLayer({
		dissipating: false
	});
	
	google.maps.event.addListener(map, 'tilesloaded', function() {
		loadPlaces(true);
	});
	
	google.maps.event.addListener(map, 'center_changed', function() {
		if (fsqLoadTimeout) { window.clearTimeout(fsqLoadTimeout); fsqLoadTimeout = null; }
		fsqLoadTimeout = window.setTimeout(loadPlaces, 1000);
		//loadPlaces();
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
