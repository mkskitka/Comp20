// Script Language = JAVA

var loadFile = function(event) {
    var reader = new FileReader();
    reader.onload = function(){
      var output = document.getElementById('output');
      var image = document.getElementById('64bitImage');
      console.log(reader.result);
      output.src = reader.result;
      image.value = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};
