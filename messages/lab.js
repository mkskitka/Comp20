
function parse() {
var request = new XMLHttpRequest();
var url = "https://messagehub.herokuapp.com/messages.json";
request.open("GET", url, true);
request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            raw = request.responseText;
            var data = JSON.parse(raw);
              var out = "";
            //console.log(data);   
            for (var i = 0; i < data.length; i++) {
                out += data[i].content + " " + data[i].username + '<br/>';
            }
        document.getElementById("messages").innerHTML = out;
        }
  
    }