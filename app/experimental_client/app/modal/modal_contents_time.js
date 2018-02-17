var setTodaysDate = function(){ 
    /* This function will load as soon as the time contents in the filter modal loads.
    It sets today's date in the time filter window. */

    date = new Date();
    
    year = date.getFullYear();
    
    //need offset of 1 to display correct month
    month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    
    day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    
    resultString = year + "-" + month + "-" + day;
    document.getElementById("to_date").value = resultString;
}

