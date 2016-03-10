var request = new XMLHttpRequest();
var url = "data.json";

request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
        var data = JSON.parse(request.responseText);
        //console.log(data);
        parse(data);
    }
};

request.open("GET", url, true);
request.send(null);

function parse(data) {
    var out = "";
    var i;
    for(i = 0; i < data.length; i++) {
        out += data[i].content + " " + data[i].username + '<br/>';
    }
    document.getElementById("messages").innerHTML = out;
}