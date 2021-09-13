// Variables
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
var apiKey = "0330340fdd1428ea8d2c085e2aefb94d";

function search() {
  var cityInput = document.getElementById("cityInput");
  var currentCity = cityInput.value;

  // Check to see if there's any input first
  if(currentCity.length != 0) {
    getWeather(currentCity);
  }
}

function showHistory() {
  var cityList = document.getElementById("cityList");
  
  // Clear the list before populating the history
  cityList.innerHTML = "";

  // Display the contents of the search history and use the prepend() method to show searches in most recently searched order
  for(var i = 0; i < searchHistory.length; i++) {
    var listItem = document.createElement("li");

    // Display the city name
    listItem.textContent = searchHistory[i];

    // Set the city name as a data attribute
    listItem.setAttribute("data-city", searchHistory[i]);

    // Add class for styling
    listItem.classList.add("list-group-item");

    // If the city is the current search, add the "active" class
    if(i == searchHistory.length - 1) {
      listItem.classList.add("active");
    }

    // Get the weather data of city if item is clicked
    listItem.addEventListener("click", function() {
      getWeather((this).getAttribute("data-city"));
    });

    cityList.prepend(listItem);
  }

  clearHistory();
}

function clearHistory() {
  var clearList = document.getElementById("clearList");  

  // Add the Clear History button if there are any cities in the search history and if the button hasn't already been added
  if(searchHistory.length > 0 && clearList.getElementsByTagName("li").length == 0) {
    var clearItems = document.createElement("li");

    clearItems.textContent = "Clear History";
    clearItems.classList.add("list-group-item");
  
    clearItems.addEventListener("click", function() {
      // Clear both the city and clear lists
      cityList.innerHTML = "";
      clearList.innerHTML = "";

      // Clear the searchHistory array and localStorage
      searchHistory = [];
      localStorage.clear();
    });

    clearList.append(clearItems);
  }
}

function processCityName(cityName) {
  // Ensure that the first letter of each word is always capitalized
  return cityName.replace(/\w\S*/g, function(text) {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  });
}

function convertTemperature(temp) {
  // Converts temperature from Kelvin to Fahrenheit
  return parseInt((temp - 273.15) * (9/5) + 32);
}

function getUVI(lat, lon) {
  var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {

    var uvIndex = response.current.uvi;
    var uvDisplay = document.getElementById("uvDisplay");
    var colorClass = "";

    uvDisplay.textContent = uvIndex;

    // Determine the level of the UV index 
    if(uvIndex >= 0 && uvIndex < 3) {
      colorClass = "uv-low";
    }
    else if(uvIndex >= 3 && uvIndex < 6) {
      colorClass = "uv-medium";
    }
    else if(uvIndex >= 6 && uvIndex < 8) {
      colorClass = "uv-high";
    }
    else if(uvIndex > 8 && uvIndex < 11) {
      colorClass = "uv-veryHigh";
    }
    else {
      colorClass = "uv-extremelyHigh";
    }

    // Add the class based on the UV index level
    uvDisplay.classList.add(colorClass);

  });
}

function getWeather(cityName) {
  var date = new Date();
  var currentDate = "(" + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + ")";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {

    // Check to see search history already includes the current city and delete it from the searchHistory array if so
    if(searchHistory.includes(processCityName(cityName))) {
      var index = searchHistory.indexOf(processCityName(cityName));
      searchHistory.splice(index, 1);
    }

    // Add the current city to the searchHistory array and then add the searchHistory array to localStorage
    searchHistory.push(processCityName(cityName));
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Generate today's weather report
    document.getElementById("currentWeatherContainer").classList.remove("hide");
    document.getElementById("cityAndDate").innerHTML = response.name + " " + currentDate;
    document.getElementById("icon").innerHTML = "<img src=\"http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png\" alt=\"weather-icon\">";
    document.getElementById("temperature").innerHTML = "Temperature: " + convertTemperature(response.main.temp) + "&deg;";
    document.getElementById("humidity").innerHTML = "Humidity: " + response.main.humidity + "%";
    document.getElementById("windSpeed").innerHTML = "Wind Speed: " + (response.wind.speed * 2.2369362921).toFixed(2) + " MPH";
    document.getElementById("uvIndex").innerHTML = "UV Index: <span id=\"uvDisplay\"></span>";

    getUVI(response.coord.lat, response.coord.lon);

    // console.log(searchHistory);
    // console.log(response);

    showHistory();

  }).fail(function() {
    console.log("FAIL!!!")
  });
}

showHistory();

// Add EventListeners to Buttons
document.getElementById("searchButton").addEventListener("click", search);
