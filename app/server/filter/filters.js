/*
Cant find any function calls from this one. Unless the export in the last row does something.
*/
function BuildMinMax(attribute, min, max) {
    var filter = { range: {} };
    filter.range[attribute] = {};
    if(min != null)
      filter.range[attribute].gte = min;
    if(max != null)
      filter.range[attribute].lte = max;

    return filter;
}
/*
 Seems like the line below creates a "shortcut" to the above function and is used
 heavily in index.js like: filter.MinMax("timestamp", date.start, date.end)
*/
exports.MinMax = BuildMinMax;
