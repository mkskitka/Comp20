<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href= "style.css"/>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<script src="https://maps.googleapis.com/maps/api/js"></script>
<script>
/*<link rel="stylesheet" href="geolocation map style.css"/>*/
	var map;
	var data;
	var raw;
	var name = "EDMUND_ROMERO";
	var url = "https://defense-in-derpth.herokuapp.com/sendLocation";
	var myLat;
	var myLng;
	var request = new XMLHttpRequest();
	var marker;
	var min;
	
	   
	function init() {
		latlng = new google.maps.LatLng(myLat, myLng);
			var myOptions = {
			center: me,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		var me = new google.maps.LatLng(myLat, myLng);
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		getMyLocation(me);
	}
	function getMyLocation(me) {
		if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
			navigator.geolocation.getCurrentPosition(function(position) {
				myLat = position.coords.latitude;
				myLng = position.coords.longitude;
				var me = new google.maps.LatLng(myLat, myLng);
									//centers map to my location
				map.panTo(me);
				var params = "login=" + name + "&lat=" + String(myLat) + "&lng=" + String(myLng);
				request.open("POST", url, true);
				request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				request.send(params);
				request.onreadystatechange = function(){
					if(request.readyState == 4 && request.status == 200){
						var raw = request.responseText;
						var data = JSON.parse(raw);
						setMarkers(data, me);
					}
				}
			});
		}
		else {
			alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}
	function setMarkers(data, me){	
		var image = {
    		url: 'nerd.png',
    		scaledSize: new google.maps.Size(30, 30),
    		origin: new google.maps.Point(0, 0),
    		anchor: new google.maps.Point(20, 32)
  		};
  		var image2 = {
    		url: 'landmark.png',
    		scaledSize: new google.maps.Size(30, 30),
    		origin: new google.maps.Point(0, 0),
    		anchor: new google.maps.Point(20, 32)
  		};
  		var shape = {
    		coords: [1, 1, 1, 20, 18, 20, 18, 1],
    		type: 'poly'
  		};			
		for(i = 0; i < data["people"].length; i++){
			if(data["people"][i].login == name){
				var image3 = {
    				url: 'yo.jpg',
    				scaledSize: new google.maps.Size(30, 30),
    				origin: new google.maps.Point(0, 0),
    				anchor: new google.maps.Point(20, 32)
  				};
  				  var shape = {
    				coords: [1, 1, 1, 20, 18, 20, 18, 1],
    				type: 'poly'
  				};
				var marker = new google.maps.Marker({ //creates my marker
					position: me,
					title: "ME",
					shape:shape,
					icon: image3,
					zIndex: google.maps.Marker.MAX_ZINDEX + 1,
					content: findminDistance(),
				});
				var infoWindow = new google.maps.InfoWindow();
    			google.maps.event.addListener(marker, 'click', function () {
                                infoWindow.setContent(this.content);
                                infoWindow.open(this.getMap(), this);
            });
				marker.setMap(map);				
				continue;
			}
				marker = new google.maps.Marker({
      			position: {lat: data["people"][i].lat, lng: data["people"][i].lng},
     			map: map,
     			icon: image,
     			shape: shape,
      			title: data["people"][i].login,
      			content: getContent(data["people"][i], 0),
      			
    			});
			marker.setMap(map);
    		var infoWindow = new google.maps.InfoWindow();
    		google.maps.event.addListener(marker, 'click', function () {
                                infoWindow.setContent(this.content);
                                infoWindow.open(this.getMap(), this);
            });
    	}
    	for(i = 0; i  < data["landmarks"].length; i ++){	//for Landmarks
    		bool = 1;
    		if(getDistance(data["landmarks"][i].geometry.coordinates, bool) <= 1){
    			marker = new google.maps.Marker({
      				position: {lat: data["landmarks"][i].geometry.coordinates[1], lng: data["landmarks"][i].geometry.coordinates[0]},
     				map: map,
     				shape: shape,
     				icon: image2,
      				title: data["landmarks"][i].properties.Location_Name,
      				content: String(data["landmarks"][i].properties.Details)
    			});
    			marker.setMap(map);
    			var infoWindow = new google.maps.InfoWindow();
    			google.maps.event.addListener(marker, 'click', function () {
                    			infoWindow.setContent(this.content);
                      			infoWindow.open(this.getMap(), this);
            	});
			}
		}
		findminDistance();
		function findminDistance(){
			min = data["landmarks"][0];
			for(i = 1; i < data["landmarks"].length; i++){
				if(getDistance(data["landmarks"][i].geometry.coordinates, 1) < getDistance(data["landmarks"][i-1].geometry.coordinates, 1)){
						min = data["landmarks"][i];
				}
			}
			var path = [
    		{lat: myLat, lng: myLng},
    		{lat: min.geometry.coordinates[1], lng: min.geometry.coordinates[0]},
  			];
  			var path = new google.maps.Polyline({
    		path: path,
    		geodesic: true,
    		strokeColor: '#FF0000',
   			strokeOpacity: 1.0,
    		strokeWeight: 2,
  			});
  			path.setMap(map);
  			return (min.properties.Location_Name + " is " + String(getDistance(min.geometry.coordinates)) + " miles away!");
		}
	}
	function getContent(x, bool){
		return x.login + "<br>" + " Miles Away: " + String (getDistance(x, bool)); 
	}
	
	function getDistance(x, bool){
		Number.prototype.toRad = function() {
   		return this * Math.PI / 180;
		}
		var lat2 = myLat; 
		var lon2 = myLng; 
		if(bool == 0){	//getting distance for people 
			var lat1 = x.lat; 
			var lon1 = x.lng;
		}
		else{			//getting distance for landmarks
			var lat1 = x[1];
			var lon1 = x[0];
		} 
		var R = 6371; // km 
		var x1 = lat2-lat1;
		var dLat = x1.toRad();  
		var x2 = lon2-lon1;
		var dLon = x2.toRad();  
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);  
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c; 
		d /= 1.60934; //converts km to miles
		return d; // distance
	}
</script>
<head/>
<body onload="init()">
	<div id="map_canvas" style="width:100%; height:100%"</div>
</body>
</html>