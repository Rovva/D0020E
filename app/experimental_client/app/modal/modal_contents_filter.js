/* JS functionality to load dynamic modal content and create filters. */

var dropdownSelection = "";

var loadModalContents = function (dropdownSelection, modalDropdownName) {
    /** This function loads dynamic HTML content to the modal, depending on what the user chooses. **/
  
    //hide the dropdown upon selection
    document.getElementById(modalDropdownName).classList.toggle("show");


    //load html contents to a <div> in the modal from different sources to display dynamic content.
    if (dropdownSelection == "Time") {
        $(function() {
            $("#filter_modal_dynamic_content_box_time").load("app/modal/modal_contents_time.html");
        })
    }

    else if (dropdownSelection == "Road Condition") {
        $(function() {
            $("#filter_modal_dynamic_content_box_time").load("app/modal/modal_contents_time.html");
        })
        
        $(function() {
            $("#filter_modal_dynamic_content_box").load("app/modal/modal_contents_road_condition.html");
        })
    }

    else if (dropdownSelection == "Signal") {
        $(function() {
            $("#filter_modal_dynamic_content_box_time").load("app/modal/modal_contents_time.html");
        })
        
        $(function() {
            $("#filter_modal_dynamic_content_box").load("app/modal/modal_contents_signal.html");
        })
    }

    else if (dropdownSelection == "Road Temperature") {
        $(function() {
            $("#filter_modal_dynamic_content_box_time").load("app/modal/modal_contents_time.html");
        })
        
        $(function() {
            $("#filter_modal_dynamic_content_box").load("app/modal/modal_contents_r_temp.html");
        })
    }

    else if (dropdownSelection == "Air Temperature") {
        $(function() {
            $("#filter_modal_dynamic_content_box_time").load("app/modal/modal_contents_time.html");
        })
        
        $(function() {
            $("#filter_modal_dynamic_content_box").load("app/modal/modal_contents_air_temp.html");
        })
      
    }

    else if (dropdownSelection == "Friction") {
        $(function() {
            $("#filter_modal_dynamic_content_box_time").load("app/modal/modal_contents_time.html");
        })
        
        $(function() {
            $("#filter_modal_dynamic_content_box").load("app/modal/modal_contents_friction.html");
        })
    }

    else if (dropdownSelection == "Air Humidity") {
        $(function() {
            $("#filter_modal_dynamic_content_box_time").load("app/modal/modal_contents_time.html");
        })
        
        $(function() {
            $("#filter_modal_dynamic_content_box").load("app/modal/modal_contents_air_hum.html");
        })
    }
};

var createFilter = function (buttonName) {
    /** This function is connected to the "create" button in the modal.
        It is used to create a new filter. */

    //the selected filter is decided on the actual contents of the dropdown button.
    selectedFilter = document.getElementById(buttonName).innerHTML; // show selected filter.

    //Create the filter that is chosen.

    if (selectedFilter == "Time") {
        fromDateString = new Date(Date.parse($("#from_date").val())).toISOString();
        toDateString = new Date(Date.parse($("#to_date").val())).toISOString();

        //create the time filter
        saveFilter({
            name: "",
            type: "date",
            start: fromDateString, // "2015-01-01T12:10:30Z"
            end: toDateString // "2017-01-01T12:10:30Z"
        });

    }

    else if (selectedFilter == "Signal") {
        fromDateString = new Date(Date.parse($("#from_date").val())).toISOString();
        toDateString = new Date(Date.parse($("#to_date").val())).toISOString();

        saveFilter({
            name: "",
            type: "signal",
            signal: $('#signal_dropdown').val(),
            start: fromDateString, // "2015-01-01T12:10:30Z"
            end: toDateString, // "2017-01-01T12:10:30Z",
            min: parseInt($('#min_signal').val()),
            max: parseInt($('#max_signal').val())
        });
    }

    else if (selectedFilter == "Road Temperature") {
        fromDateString = new Date(Date.parse($("#from_date").val())).toISOString();
        toDateString = new Date(Date.parse($("#to_date").val())).toISOString();

        saveFilter({
            name: "",
            type: "road_temperature",
            start: fromDateString, // "2015-01-01T12:10:30Z"
            end: toDateString, // "2017-01-01T12:10:30Z",
            min: parseInt($('#min_r_temp').val()),
            max: parseInt($('#max_r_temp').val())
        });
    }

    else if (selectedFilter == "Air Temperature") {
        fromDateString = new Date(Date.parse($("#from_date").val())).toISOString();
        toDateString = new Date(Date.parse($("#to_date").val())).toISOString();

        saveFilter({
            name: "",
            type: "air_temperature",
            start: fromDateString, // "2015-01-01T12:10:30Z"
            end: toDateString, // "2017-01-01T12:10:30Z",
            min: parseInt($('#min_air_temp').val()),
            max: parseInt($('#max_air_temp').val())
        });
    }

    else if (selectedFilter == "Air Humidity") {
        fromDateString = new Date(Date.parse($("#from_date").val())).toISOString();
        toDateString = new Date(Date.parse($("#to_date").val())).toISOString();

        saveFilter({
            name: "",
            type: "air_humidty",
            start: fromDateString, // "2015-01-01T12:10:30Z"
            end: toDateString, // "2017-01-01T12:10:30Z",
            min: parseInt($('#min_air_hum').val()),
            max: parseInt($('#max_air_hum').val())
        });
    }

    else if (selectedFilter == "Friction") {
        fromDateString = new Date(Date.parse($("#from_date").val())).toISOString();
        toDateString = new Date(Date.parse($("#to_date").val())).toISOString();

        saveFilter({
            name: "",
            type: "friction",
            start: fromDateString, // "2015-01-01T12:10:30Z"
            end: toDateString, // "2017-01-01T12:10:30Z",
            min: parseInt($('#min_friction').val()),
            max: parseInt($('#max_friction').val())

        });

    }

    //this must be called to upload the UI
    loadFilters();


}

