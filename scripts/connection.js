var elasticsearch = require("elasticsearch"),
	mysql = require("mysql"),
	util = require("util");

var s_conn = mysql.createConnection({
	host: "172.18.0.3",
	user: "user",
	password: "pass",
	database: "db"
}); s_conn.connect();
var e_conn = new elasticsearch.Client({
	host: util.format("%s:9200", process.env.ELASTICSEARCH || "127.0.0.1"),
	log: [
		{
			type: "stdio",
			level: "error"
		}
	]
});

exports.mysql = s_conn;
exports.elasticsearch = e_conn;
exports.close = function() {
	s_conn.end();
	e_conn.close();
}

