function Api() {
  var endpoint = "/api/";

  this.request = function(url, data, obj) {
    var o = obj;
    $.ajax({
      type: "POST",
      url: endpoint+url,
      dataType: "json",
      data: data,
      success: function(data) {
        if(data.status_code == 0) {
          //alert("Error: " + data.data.message);
        } else {
          obj.onData(data.data);
        }
      },
      error: function(err) {
        //alert(err);
      }
    });
  }
}
