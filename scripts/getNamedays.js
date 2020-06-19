$(document).ready(function() {
    $possibleLocations = ["cz", "sk", "pl", "fr", "hu", "hr", "se", "us", "at", "it", "es", "de", "dk", "fi", "bg", "lt", "ee", "lv", "gr", "ru"];
    $userLocation = "lv"; // Default users location
    $dateToday = $("#date-today");
    $namesToday = $("#names-today");
    $locationSelect = $("#location-select");
    $weekResultContainer = $("#this-week-container");
    $byDateResultsContainer = $("#by-date-container .result");
    $byNameResultsContainer = $("#by-name-container .result");
    $nameInput = $("#by-name-input");
    $monthSelect = $("#month-select");
    $daySelect = $("#day-select");
    $byNameBtn = $("#find-by-name");
    $byDateBtn = $("#find-by-date");
    
    var data = {
        "validate": {
            name() {
                $inputValue = $nameInput.val().toLocaleLowerCase();
                if ( $inputValue != "" ) {
                    if ( !(!!$inputValue.match(/^[a-z]*$/i)) ) {
                        $byNameResultsContainer.append(`<p class="result__error">Please input valid name.</p>`);
                        return false;
                    } else if ( $inputValue.length < 3 ) {
                        $byNameResultsContainer.append(`<p class="result__error">Name must be at least 3 characters.</p>`);
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    $byNameResultsContainer.append(`<p class="result__error">Please input name.</p>`);
                    return false;
                }
            },
            month() {
                console.log($monthSelect.val());
                if ( $monthSelect.val() == null ) {
                    $byDateResultsContainer.append(`<p class="result__error">Please select month.</p>`);
                    return false;
                } else {
                    return true;

                }
            },
            day() {
                console.log($daySelect.val());
                if ( $daySelect.val() == null ) {
                    $byDateResultsContainer.append(`<p class="result__error">Please select day.</p>`);
                    return false;
                } else {
                    return true;

                }
            },
        },
        "get": {
            "date": new Date(),
            "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "dayNames": ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday", "Sunday"],
            countryCode() {
                return $locationSelect.val();
            },
            name() {
                if ( data.validate.name() ) {
                    return $nameInput.val();
                }
            },
            month() {
                if ( data.validate.month() ) {
                    return $monthSelect.val();
                }
            },
            day() {
                if ( data.validate.day() ) {
                    return $daySelect.val();
                }
            },
            "nameday": {
                today() {
                    var day = data.get.date.getDate();
                    var dayIndex = data.get.date.getDay() - 1;
                    var monthIndex = data.get.date.getMonth();
                    $dateToday.html(`${data.get.dayNames[dayIndex]}, ${data.get.monthNames[monthIndex]} ${day}`);
                    $.ajax({
                        url: `https://api.abalin.net/namedays?country=${data.get.countryCode()}&month=${monthIndex+1}&day=${day}`,
                        success: function(response){
                            if ( response.data.namedays[data.get.countryCode()] == "n/a" ) {
                                $namesToday.html(`There are no namedays on this day :(`);
                            } else {
                                $namesToday.html(response.data.namedays[data.get.countryCode()]);
                            }
                        },
                        error: function(error){
                             console.log(`Request failed, error: ${error}`);
                        },
                    });
                },
                thisWeek(month, day, weekDay) {
                    $.ajax({
                        url: `https://api.abalin.net/namedays?country=${data.get.countryCode()}&month=${month}&day=${day}`,
                        success: function(response){
                            if ( response.data.namedays[data.get.countryCode()] == "n/a" ) {
                                $("#week-result-" + weekDay + " .result__output").html(`There are no namedays on this day :(`);
                            } else {
                                $("#week-result-" + weekDay + " .result__output").html(response.data.namedays[data.get.countryCode()]);
                            }
                        },
                        error: function(error){
                            console.log(`Request failed, error: ${error}`);
                        },
                    });
                },
                byDate(month, day) {
                    $(`#month-select option[value="0"]`).removeAttr("selected").attr('selected', true);
                    $(`#day-select option[value="0"]`).removeAttr("selected").attr('selected', true);
                    $.ajax({
                        url: `https://api.abalin.net/namedays?country=${data.get.countryCode()}&month=${month}&day=${day}`,
                        success: function(response){
                            if ( response.data.namedays[data.get.countryCode()] == "n/a" ) {
                                 $byDateResultsContainer.children(".result__output").html(`There are no namedays on this day :(`);
                            } else {
                                 $byDateResultsContainer.children(".result__output").html(response.data.namedays[data.get.countryCode()]);
                            }
                         },
                        error: function(error){
                            console.log(`Request failed, error: ${error}`);
                        },
                    });
                },
                byName(name) {
                    $.ajax({
                        url: `https://api.abalin.net/getdate?name=${name}&country=${data.get.countryCode()}`,
                        success: function(response){
                            if ( response.results.length == 0 ) {
                                $byNameResultsContainer.append(`<p class="result__output">There are no namedays on this day :(</p>`);
                            } else {
                                for ( var i = 0; i < response.results.length; i++ ) {
                                    $responseMonth = response.results[i].month;
                                    $responseDay = response.results[i].day;
                                    $byNameResultsContainer.append(`<p class="result__output">${data.get.monthNames[$responseMonth-1]} ${$responseDay}</p>`);
                                }
                            }
                        },
                        error: function(error){
                             console.log(`Request failed, error: ${error}`);
                        },
                    });
                },
            }
        },
        "generate": {
            weekResults() {
                $today = data.get.date;
                for( var i = 0; i < 7; i++ ) {
                    $weekDay = i;
                    $thisDay = new Date(data.get.date);
                    $thisDay.setDate($today.getDate() - ($today.getDay() - (i + 1)));
                    $weekResultContainer.append(`<div id="week-result-${i}" class="result"></div>`);
                    $("#week-result-" + i).append(`<h3 class="result__search-value">${data.get.dayNames[i].substring(0, 3)}, ${data.get.monthNames[$thisDay.getMonth() + 1]} ${$thisDay.getDate()}</h3>`);
                    $("#week-result-" + i).append(`<p class="result__output"></p>`);
                    data.get.nameday.thisWeek(($thisDay.getMonth() + 1), $thisDay.getDate(), i);
                }
            },
            byDateResults() {
                if ( data.validate.month() && data.validate.day() ) {
                    $byDateResultsContainer.append(`<h3 class="result__title">Namedays on</h3>`);
                    $byDateResultsContainer.append(`<h2 class="result__search-value">${data.get.monthNames[data.get.month()-1]} ${data.get.day()}</h2>`);
                    $byDateResultsContainer.append(`<p class="result__output"></p>`);
                    data.get.nameday.byDate(data.get.month(), data.get.day());
                }
            },
            byNameResults() {
                if ( data.validate.name() ) {
                    $byNameResultsContainer.append(`<h3 class="result__title">Matching namedays for</h3>`);
                    $byNameResultsContainer.append(`<h2 class="result__search-value">${data.get.name()}</h2>`);
                    data.get.nameday.byName(data.get.name());
                }
            },
        },
        "hide": {
            results() {
                $(".result").empty();
            }
        },
    }
    
    for ( var i = 0; i < $possibleLocations.length; i++ ) {
        $locationSelect.append(`<option value="${$possibleLocations[i]}">${$possibleLocations[i].toUpperCase()}</option>`);
    }
    
    data.hide.results();
    
    $.ajax({
        url: "http://ip-api.com/json",
        success: function(response){
            if ($possibleLocations.indexOf(response.countryCode.toLowerCase()) > -1) {
                $userLocation = response.countryCode.toLowerCase();
                $(`#location-select option[value=${$userLocation}]`).attr('selected', true);
            } else {
                $(`#location-select option[value=${$userLocation}]`).attr('selected', true);
            }
            data.get.nameday.today();
            data.generate.weekResults();
        },
        error: function(error){
            console.log(`Request failed, error: ${error}`);
        },
    });
    
    $locationSelect.change(function() {
        data.hide.results();
        data.get.nameday.today();
        data.generate.weekResults();
    });
    
    $byNameBtn.click(function() {
        $byNameResultsContainer.empty();
        data.generate.byNameResults();
        $nameInput.val("");
    });
    
    $byDateBtn.click(function() {
        $byDateResultsContainer.empty();
        data.generate.byDateResults();
    });
});