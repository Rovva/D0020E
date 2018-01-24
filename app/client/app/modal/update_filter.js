/* WORK IN PROGRESS, NOT USED */
/* This JS functionality is connected to updating saved filters. */

var viewSavedFilter = function(filterObject) {
    /* open the modal contents of a filter that has been saved */
    
    type = filterObject.type;
    
    if (type == "date") {

        
        //update input fields
        fromDate = new Date(filterObject.start);
        toDate = new Date(filterObject.end);
        
        fromDateString = fromDate.getFullYear() + "-" + formatTwoDigits(fromDate.getMonth()) + "-" + formatTwoDigits(fromDate.getDate());
        toDateString = toDate.getFullYear() + "-" + formatTwoDigits(toDate.getMonth()) + "-" + formatTwoDigits(toDate.getDate());
        

        
        fromTimeString = formatTwoDigits(fromDate.getHours()) + ":" + formatTwoDigits(fromDate.getMinutes()) + ":" + formatTwoDigits(fromDate.getSeconds());
        toTimeString = formatTwoDigits(toDate.getHours()) + ":" + formatTwoDigits(toDate.getMinutes()) + ":" + formatTwoDigits(toDate.getSeconds());
        
        
            
        $(function() {
            $("#update_modal_dynamic_content_box").load("app/modal/modal_contents_time.html", function() {
       /*         $("#from_date").val(fromDateString);      //these do not update correctly. It is probably due to the fact that the HTML site has not been loaded yet.
                $("#to_date").val(toDateString);
                $("#from_time").value = fromTimeString;
                $("#to_time").value = toTimeString; */
            });
        }) 
        
    }
    
    else {
    //If the filters are of the type that has a min and max value only.
        minInputFieldName = "";
        maxInputFieldName = "";

        if (type == "signal") {
            $(function() {
                $("#update_modal_dynamic_content_box").load("app/modal/modal_contents_signal.html");
            })
            
            minInputFieldName = "min_signal";
            maxInputFieldName = "max_signal";
        }

        else if (type == "road_temperature") {
            $(function() {
                $("#update_modal_dynamic_content_box").load("app/modal/modal_contents_r_temp.html");
            })            
            
            minInputFieldName = "min_r_temp";
            maxInputFieldName = "max_r_temp";
        }

        else if (type == "air_temperature") {
            $(function() {
                $("#update_modal_dynamic_content_box").load("app/modal/modal_contents_air_temp.html");
            })            
            
            minInputFieldName = "min_air_temp";
            maxInputFieldName = "max_air_temp";
        }

        else if (type == "air_humidity") {
            $(function() {
                $("#update_modal_dynamic_content_box").load("app/modal/modal_contents_air_hum.html");
            })          
            
            minInputFieldName = "min_air_hum";
            maxInputFieldName = "max_air_hum";
        }

        else if (type == "friction") {
            $(function() {
                $("#update_modal_dynamic_content_box").load("app/modal/modal_contents_friction.html");
            })            
            
            minInputFieldName = "min_friction";
            maxInputFieldName = "max_friction";
        }

        //set the values of the fields.
        $(minInputFieldName).value = filterObject.min;
        $(maxInputFieldName).value = filterObject.max;        
    }
    

}



function formatTwoDigits(value) {
    /* This function formats the date values to consist of two digits */
    
    if (value < 10) {
        value = "0" + value;
    }
    return value;
}