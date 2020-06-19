$(document).ready(function() {
    var monthInfo = {
        0:  {name: "January",   days: 31},
        1:  {name: "February",  days: 29},
        2:  {name: "March",     days: 31},
        3:  {name: "April",     days: 30},
        4:  {name: "May",       days: 31},
        5:  {name: "June",      days: 30},
        6:  {name: "July",      days: 31},
        7:  {name: "August",    days: 31},
        8:  {name: "September", days: 30},
        9:  {name: "October",   days: 31},
        10: {name: "November",  days: 30},
        11: {name: "December",  days: 31},
    }
    
    for ( var i = 0; i < 12; i++ ) {
        $("#month-select").append(`<option value="${i+1}">${monthInfo[i].name}</option>`);
    }
    
    function daysInMonth() {
        if ($("#month-select").val() - 1 < 0) {
            return 31;
        } else {
            return monthInfo[$("#month-select").val() - 1].days;
        }
    }
    function changeDaysInMonth() {
        for ( var i = 1; i <= 31; i++ ) {
            $(`#day-select option[value=${i}]`).remove();
        }
        for ( var i = 0; i < daysInMonth(); i++ ) {
            $("#day-select").append(`<option value="${i+1}">${i+1}</option>`);
        }
    }
    
    changeDaysInMonth();
    
    $("#month-select").change(function() {
        changeDaysInMonth();
    });
    
});