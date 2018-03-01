/*
success and error returns an object with an object retrieved from constants.js. The objects will have a status of 1 or 0.
*/
var constants = require("./constants"),
  elaticsearch = require("elasticsearch"),
  success = function() {
    return constants.getSuccessObject();
  },
  error =  function() {
    return constants.getErrorObject();
  }

/*
Creates global variables _elasticsearch, _filters, _default_query and _query. _default_query will hold certain variables and at the end _query = _default_query for some reason (?)
This function is called in routes.js several times
*/
function Query(elaticsearch, filters) {

  var _elasticsearch = elaticsearch,
    _filters = filters,
    _default_query = {
      index: "measurement",
      body: {
        size: 0,
        query: _filters,
  			aggregations: {}
      }
    },
    _query = _default_query;

  var make = function(query, cb) {
    _elasticsearch.search(query, function(p_err, res) {
      var obj = success(),
        err = null;

      if(p_err) {
        err = p_err.msg;
        obj = error();
        obj.data.message = "Internal error.";
      }

      cb(res, obj, err);
    });
  };

  this.query = function(cb) {
    make(_query, cb);
  }
  this.set = function(cb) {
    _query = cb(_query);
  };
}

exports.Query = Query;
