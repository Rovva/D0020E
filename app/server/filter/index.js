var util = require("util");

var filter = require("./filters");


function Filter() {
	var _filters = {bool:{must:[]}};
	

	var _params = [];
	var _expression = "";

	this.QueryParams = function(params, expression) {
		_params = params;
		_expression = expression;
	};

	function parseData(type,value){
		switch(type){
		  	case "date":
				_filters.bool.must.push({range:{"timestamp":{"gte":value.start,"lte":value.end}}});
			    	break;

			case "polygon":
				_filters.bool.must.push({
					geo_polygon : {
						location:{
							points:value.points							
						}
					}
				});		
						
				break;

			case "circle":
				_filters.bool.must.push({
					geo_distance : {
					    distance : value.radius,
					    location : {
						lat : value.point.lat,
						lon : value.point.lon
					    }
					}
				});
				break;
			
  		}
	}

	this.Parse = function() {
		for (var type in _params) {
			parseData(type,_params[type]);
		} 
	};

	this.ElasticsearchQuery = function() {
		return _filters;
	}
}

exports.middleware = function(req, res, next) {
  if(req.body["filters"] != null) {
    var filter = new Filter();
    filter.QueryParams(req.body.filters, req.body.expression);
    filter.Parse();
    req.filters = filter.ElasticsearchQuery();
		console.log(JSON.stringify(req.filters, null, 2));
		console.log(JSON.stringify(req.body.filters, null, 2));
		console.log(req.originalUrl);
  }
  next();
}

exports.Filter = Filter;
