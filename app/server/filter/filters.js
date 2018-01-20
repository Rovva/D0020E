/*
Cant find any function calls from this one. Unless the export in the last row does something.

 It seems like what this function does, is creating an array using the function "range" (works like python range)
 and returning it to the last line in this function "exports.MinMax". The range is used 
 to fill an array of all the hours between 01:00 and 08:00 as an example.

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
 Seems like the line below creates a "shortcut" to the result of the above function and is used
 heavily in index.js like: filter.MinMax("timestamp", date.start, date.end)
*/
exports.MinMax = BuildMinMax;
