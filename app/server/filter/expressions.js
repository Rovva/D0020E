function Expression(expression, filters) {
	var _expression = expression;
	var _filters = filters;

	this._to_polish = function() {
		var stack = [];
		var output = [];
		var in_name = false;
		var filter_name = "";
		for(var i = 0; i<_expression.length; i++) {
			var c = _expression[i];
			switch(c) {
				case ")":
					if(in_name) {
						output.push(_filters[filter_name]);
						filter_name = "";
						in_name = false;
					}

					while(stack[0] != "(") {
						output.push(stack.shift());
					}
					stack.shift();
					if(stack.length > 0 && stack[0] in ["*", "+"]) {
						output.push(stack.shift());
					}
					break;
				case "!":
				case "*":
				case "+":
				case "(":
					if(in_name) {
						output.push(_filters[filter_name]);
						filter_name = "";
						in_name = false;
					}

					stack.unshift(c)
					break;
				default:
					in_name = true;
					filter_name += c;
			}
		}
		// If there is something left
		if(filter_name != "") {
			output.push(_filters[filter_name]);
		}

		while(stack.length != 0)
			output.push(stack.shift());

		output.reverse();
		return output;
	}

	this._create_elasticsearch = function(polish, inb) {
		if(polish.length == 0)
			return;

		var c = polish.shift();
		var r = {};
		var ib = c == "+" || c == "*" || c == "!";
		switch(c) {
			case "*":
				var m1 = this._create_elasticsearch(polish),
					m2 = this._create_elasticsearch(polish);

				if(m1 != null || m2 != null) {
					r["must"] = [];
					if(m1 != null)
						r["must"].push(m1);
					if(m2 != null)
						r["must"].push(m2);
				}
				break;
			case "+":
				var s1 = this._create_elasticsearch(polish),
					s2 = this._create_elasticsearch(polish);

				if(s1 != null || s2 != null) {
					r["should"] = [];
					if(s1 != null)
						r["should"].push(s1);
					if(s2 != null)
						r["should"].push(s2);
				}
				break;
			case "!":
				var mn = this._create_elasticsearch(polish);
				if(mn != null) {
					r["must_not"] = [];
					r["must_not"].push(mn);
				}
				break;
			default:
				r = c;
				return r;
				break;
		}

		return ib ? { "bool": r } : r;
	}

	this.ElasticsearchBoolExpression = function() {
		/*
		var expression = "((d*v)+(a+b)*!(c+d)*e*d)";
		console.log(expression);
		var polish = parse(expression);
		console.log(polish);
		var elastic = to_elasticsearch(polish);
		console.log(JSON.stringify(elastic, null, 2));
		*/
		var polish = this._to_polish();
		if(polish.length == 1)
			polish.unshift("*");
		return this._create_elasticsearch(polish);
	}
}

module.exports = function(expression, filters) {
	var exp = new Expression(expression, filters);
	return exp.ElasticsearchBoolExpression();
}
