var map;

//main document ready function
$(document).ready(function () {

	//initialize basemap
	var worldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
		maxZoom: 16
	});
	var worldBoundAndPlacesRef = L.tileLayer("https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
		attribution: 'Copyright: &copy; 2013 Esri, DeLorme, NAVTEQ'
	});

	//initialize map
	map = new L.Map('map', {
		center: new L.LatLng(42.75, -75.5),
		zoom: 7,
		layers: [worldGrayCanvas, worldBoundAndPlacesRef],
		attributionControl: false,
		zoomControl: false
	});

	function onEachFeature(feature, layer) {
		//console.log(feature);
		if (feature.properties.ReachCode) {
			layer.bindPopup("<b>ReachCode</b>: " + feature.properties.ReachCode, {
				maxWidth : 150,
				maxHeight : 70
			});
		} else if (feature.properties.real_site) {
			layer.bindPopup("<b>Real site</b>: True<br><b>Site No.</b>: " + feature.properties.site_no, {
				maxWidth : 150,
				maxHeight : 70
			});
		} else {
			layer.bindPopup("<b>Real site</b>: False<br><b>Assigned ID</b>: " + feature.properties.assigned_id + "<br><b>ID</b>: " + feature.properties.id, {
				maxWidth : 150,
				maxHeight : 70
			});
		}
	}

	var theCircleIcon = new L.icon({
		iconUrl: 'circle.PNG',
		iconSize:     [10, 10], // size of the icon  
	});

	var theTriangleIcon = new L.icon({
		iconUrl: 'triangle.PNG',
		iconSize:     [13, 13], // size of the icon  
	});

	// load GeoJSON from an external file
	$.getJSON("data.json",function(data){
		// add GeoJSON layer to the map once the file is loaded
		var theJsonLayer = L.geoJson(data, {
			pointToLayer: function (feature, latlng) {
				//console.log(feature);
				if (feature.properties.id) {
					return L.marker(latlng, {icon: theCircleIcon});
				}
				return L.marker(latlng, {icon: theTriangleIcon});
			},
			onEachFeature: onEachFeature
		}).addTo(map);
		map.fitBounds(theJsonLayer.getBounds());
	});

	//end document ready function
});