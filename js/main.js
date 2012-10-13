$(document).ready(function() {
	var mapOptions = {
		//center : new google.maps.LatLng(-34.397, 150.644),
		zoom : 8,
		mapTypeId : google.maps.MapTypeId.HYBRID
	};
	var map = new google.maps.Map(
			document.getElementById("map_canvas"), mapOptions);
});
