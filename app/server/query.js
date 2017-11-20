var constants = require("./constants"),
  elaticsearch = require("elasticsearch"),
  success = function() {
    return constants.getSuccessObject();
  },
  error =  function() {
    return constants.getErrorObject();
  }

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
