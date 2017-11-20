/*
 * Dont even try
 * to understand this
 * */
function ensure(data, struct) {
	return true;
	if(typeof(data) == typeof(struct)) {
		if(typeof(data) == "object") {
			var data_is_array = Array.isArray(data);
			var struct_is_array = Array.isArray(struct);
			if(data_is_array != struct_is_array) {
				return false;
			}

			if(data_is_array) {
				if(data.length == 0)
					return false;

				var struct_ar = struct[0];
				var tmp = [];
				for(var i = 0; i<data.length; i++) {
					tmp.push(true && ensure(data[i], struct_ar))
				}
				var r = true;
				for(var i = 0; i<tmp.length; i++)
					r = r && tmp[i];
				return r;
			} else {
				var tmp = [];
				for(var i in struct) {
					if(data[i] == null)
						return false;

					tmp.push(true && ensure(data[i], struct[i]));
				}
				var r = true;
				for(var i = 0; i<tmp.length; i++) {
					r = r && tmp[i];
				}
				return r;
			}
		} else {
			return true;
		}
	} else {
		return false;
	}
}

module.exports = ensure
