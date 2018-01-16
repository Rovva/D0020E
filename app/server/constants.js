
/*
This class is some kind of error-managing when using objects, used in query.js and routes.js
*/

module.exports = {
  "default_return_object": {
  	"status_code": 1,
  	"data": {}
  },
  "status_codes": {
    "ERROR": 0,
    "SUCCESS": 1
  },
  /*
	This function returns a new object with a status code equal to SUCCESS (1) 
  */
  getSuccessObject: function() {
    var obj = this.default_return_object;
    obj.status_code = this.status_codes.SUCCESS;
    return obj;
  },
  /*
	This function returns a new object with a status code equal to ERROR (0) 
  */
  getErrorObject: function() {
    var obj = this.default_return_object;
    obj.status_code = this.status_codes.ERROR;
    obj.data.message = "";
    return obj;
  }
}
