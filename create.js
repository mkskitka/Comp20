// Script Language = JAVA

var loadFile = function(event) {
    var reader = new FileReader();
    reader.onload = function(){
      var output = document.getElementById('output');
      output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};

var rowNum = 0;

var rowNum = 0;
function addRow(frm) {
rowNum ++;
var row = '<p id="rowNum'+rowNum+'">Amount: <input type="text" name="qty[]" size="4" value="'+frm.add_qty.value+'"> Ingredient: <input type="text" name="name[]" value="'+frm.add_name.value+'"> <input type="button" value="Remove" class="btn btn-default" onclick="removeRow('+rowNum+');"></p>';
jQuery('#itemRows').append(row);
frm.add_qty.value = '';
frm.add_name.value = '';
}

function removeRow(rnum) {
jQuery('#rowNum'+rnum).remove();
}