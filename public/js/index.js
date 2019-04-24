var server = window.location.origin;

console.log("connected");

const mymap = L.map('mapid').setView([40.766376, -73.96116], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1Ijoic3BlbmczMTciLCJhIjoiY2pxNjR3amY2MGljejQyb2lwZml2YnVncyJ9.o_fyJ3rCkR2nnNgBCEXMpQ'
}).addTo(mymap);

$(document).ready(function () {
	var host = window.location.origin;
	var dataUrl = host + '/data';
	var geoJSONdata = [];
	var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
	};

	function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
	}

	drawMap();

	function drawMap() {
		$.ajax({
			url: dataUrl,
			type: 'GET',
			success: function(results) {
				console.log(results)
				// create geoJSON object from return data
				results.forEach(function(item) {
					console.log(item)
					var popupContent = "<b>" + item.locationName + "</b>" + "<br>" + item.category + "<br>" + "Suggested by: " + item.suggestion;
					geoJSONdata.push(
						{
							"type": "Feature",
							"properties": {
								"name": item.locationName,
								"popupContent": popupContent 
							},
							"geometry": {
								"type": "Point",
								"coordinates": [item.longitude, item.latitude]
							}
						}
					)
				})
				L.geoJSON(geoJSONdata, {
					onEachFeature: onEachFeature
				}).addTo(mymap);
	
			},
			error: function(error) {
				console.log(error);
			}
		});
	}
});

$('#form').submit(function() {
	event.preventDefault();
	var apiKey = "7nPESk71FDa56t59tB8vZ3amNj4TidIw";
	var addressString = $('#address').val() + " manhattan ny";
	var correctedAddress = addressString.replace(/\s/g, '%');

	$.ajax({
		url: "http://www.mapquestapi.com/geocoding/v1/address",
		dataType: 'jsonp',
		crossDomain: true,
		data: {
			key: decodeURIComponent(apiKey),
			location: correctedAddress
		},
		type: 'GET',
		success: function(results) {
			var addressInfo = results.results[0].locations[0]

			var fullAddress = addressInfo.street + ", " + addressInfo.adminArea5 + ", " + addressInfo.adminArea3 + ", " + addressInfo.postalCode; 
			var latitude = addressInfo.displayLatLng.lat;
			var longitude = addressInfo.displayLatLng.lng;
			var category = $('#category').val();
			var locationName = $('#name').val();
			var notes = $('#notes').val();
			var suggestedBy = $('#suggestedBy').val();
			
			var allData = [ fullAddress, latitude, longitude, category, locationName, notes, suggestedBy ]

			// POST to server to add 
			$.ajax({
				url: server + "/create_user",
				crossDomain: true,
				type: "POST",
				data: {fullAddress, latitude, longitude, category, locationName, notes, suggestedBy},
				success: function() {										
					location.reload(function(){
						console.log("done loading")
					});					
					alert("successful add!")
					drawMap();
				},
				error: function(error) {
					alert("There was an error trying to post to server")
				}
			});	
		},
		error: function(error) {
			alert("Sorry there was an error");
		}
	});
});
