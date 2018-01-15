//makes a AJAX(Async. javascript and XML) post to /api/url where url is the request type. Runs the obj onData method if there was no error.
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
