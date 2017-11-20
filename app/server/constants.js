module.exports = {
  "default_return_object": {
  	"status_code": 1,
  	"data": {}
  },
  "status_codes": {
    "ERROR": 0,
    "SUCCESS": 1
  },
  getSuccessObject: function() {
    var obj = this.default_return_object;
    obj.status_code = this.status_codes.SUCCESS;
    return obj;
  },
  getErrorObject: function() {
    var obj = this.default_return_object;
    obj.status_code = this.status_codes.ERROR;
    obj.data.message = "";
    return obj;
  }
}
