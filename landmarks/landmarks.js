var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
  zoom: 14,
  center: me,
}
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var distancePeople = [];
var distancePlaces = [];
var meMarker = new google.maps.MarkerImage('markers.png', new google.maps.Size(36, 36), new google.maps.Point(288,205), new google.maps.Point(18, 36));
var personMarker = new google.maps.MarkerImage('markers.png', new google.maps.Size(36, 36), new google.maps.Point(36,123), new google.maps.Point(18, 36));
var landmarkMarker = new google.maps.MarkerImage('markers.png', new google.maps.Size(36, 36), new google.maps.Point(504,164), new google.maps.Point(18, 36));
var closestLMdist = 1;
var closestLMname;
var closestLMlat;
var closestLMlng;

function initialize() {
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  getLocation();
}

function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myLat = position.coords.latitude,
      myLng = position.coords.longitude,
      renderMap()
    })
  }
}

function renderMap() {
  me = new google.maps.LatLng(myLat, myLng);
  map.panTo(me);
  marker = new google.maps.Marker({
    position: me,
    map: map,
    title: "EDMUND_ROMERO",
    icon: meMarker
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(marker.title + "<br>Closest Landmark: " + closestLMname + "<br> Distance: " + closestLMdist + " miles");
    infowindow.open(map, marker);
  });
  infowindow.setContent("Logged on: " + marker.title);
  infowindow.open(map, marker);
  parse()
}

function parse() {
  postData(function(response) {
    var info = JSON.parse(response);
    var others = [];
    var LMs = [];
    for (var i = 0; i < info.people.length; i++) {
      if (info.people[i].login != "EDMUND_ROMERO") {
        var classmate = new google.maps.LatLng(info.people[i].lat, info.people[i].lng);
        others[i] = new google.maps.Marker({
          position: classmate,
          title: info.people[i].login,
          icon: personMarker
        });
        others[i].setMap(map);
        distancePeople[i] = findDistance(info.people[i].lat, info.people[i].lng);
        google.maps.event.addListener(others[i], 'click', (function(i) {
          return function() {
            infowindow.setContent(others[i].title + '<br>Dist: ' + distancePeople[i] + " miles");
            infowindow.open(map, others[i]);
          }
        })(i));
      }
    }

    for (var x = 0; x < info.landmarks.length; x++) {
      var LMLatLng = new google.maps.LatLng(info.landmarks[x].geometry.coordinates[1], info.landmarks[x].geometry.coordinates[0]);
      distancePlaces[x] = findDistance(info.landmarks[x].geometry.coordinates[1], info.landmarks[x].geometry.coordinates[0]);
      if (distancePlaces[x] < 1) {
        LMs[x] = new google.maps.Marker({
          position: LMLatLng,
          title: info.landmarks[x].properties.Location_Name,
          icon: landmarkMarker
        });
        LMs[x].setMap(map);
        google.maps.event.addListener(LMs[x], 'click', (function(x) {
          return function() {
            infowindow.setContent(info.landmarks[x].properties.Details);
            infowindow.open(map, LMs[x]);
          }
        })(x));
      }
      if (distancePlaces[x] < closestLMdist) {
        closestLMdist = distancePlaces[x];
        closestLMname = info.landmarks[x].properties.Location_Name;
        closestLMlat = info.landmarks[x].geometry.coordinates[1];
        closestLMlng = info.landmarks[x].geometry.coordinates[0];
        var polylineCoords = [
          {lat: myLat, lng: myLng},
          {lat: closestLMlat, lng: closestLMlng}
        ];
        var polyline = new google.maps.Polyline({
          path: polylineCoords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        polyline.setMap(map);
      }
    }
  });
}

function postData(jsonData) {
  var xml = new XMLHttpRequest();
  //var url = "https://agile-wave-42960.herokuapp.com/sendLocation";
  var url = "http://localhost:5000/sendLocation";

  var data = "login=EDMUND_ROMERO&lat=";
  data = data.concat(myLat);
  data = data.concat("&lng=");
  data = data.concat(myLng);
  xml.open("POST", url, true);
  xml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xml.send(data);
  xml.onreadystatechange = function() {
    if (xml.readyState == 4 && xml.status == "200") {
      jsonData(xml.responseText);
    }
  };
}

// findDistance function based off of stackoverflow post on the Haversine Formula. Found at http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
function findDistance(lat_of_other, lng_of_other) {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
  var lat2 = lat_of_other;
  var lon2 = lng_of_other; 
  var lat1 = myLat; 
  var lon1 = myLng; 
  var R = 3959;
  var x1 = lat2-lat1;
  var dLat = x1.toRad();  
  var x2 = lon2-lon1;
  var dLon = x2.toRad();  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);  
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}
