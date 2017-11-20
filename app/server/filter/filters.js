var ensure = require("./ensure");

function BuildMinMax(attribute, min, max) {
    var filter = { range: {} };
    filter.range[attribute] = {};
    if(min != null)
      filter.range[attribute].gte = min;
    if(max != null)
      filter.range[attribute].lte = max;

    return filter;
}

exports.MinMax = BuildMinMax;
