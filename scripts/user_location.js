$(document).ready(function() {
    var possibleLocations = ["cz", "sk", "pl", "fr", "hu", "hr", "se", "us", "at", "it", "es", "de", "dk", "fi", "bg", "lt", "ee", "lv", "gr", "ru"];
    var userLocation = "lv"; // Default users location
    localStorage.setItem('location-detected', false);
    
    // Generates select options for countrys
    for ( var i = 0; i < possibleLocations.length; i++ ) {
        $("#location-select").append(`<option value="${possibleLocations[i]}">${possibleLocations[i].toUpperCase()}</option>`);
    }
    
    // Gets users location
    $.ajax({
        url: "http://ip-api.com/json",
        success: function(response){
            if (possibleLocations.indexOf(response.countryCode.toLowerCase()) > -1) {
                userLocation = response.countryCode.toLowerCase();
                $(`#location-select option[value=${userLocation}]`).attr('selected', true);
            } else {
                $(`#location-select option[value=${userLocation}]`).attr('selected', true);
            }
            localStorage.setItem('location-detected', true);
        },
        error: function(error){
            console.log(`Request failed, error: ${error}`);
        },
    });
});