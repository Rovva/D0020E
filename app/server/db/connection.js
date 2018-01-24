var elasticsearch = require("elasticsearch"),
	util = require("util");

// Middleware for connecting to elasticsearch
function connect(req, res, next) {
	req.db = {
		elasticsearch: new elasticsearch.Client({
			host: util.format("%s:9200", process.env.ELASTICSEARCH || "127.0.0.1"),
			log: [
				{
					type: 'file',
					level: 'trace',
					path: '/opt/rcm/log/elasticsearch.log'
				}
			]
		})
	}
	next();
}

exports.middleware = connect;
