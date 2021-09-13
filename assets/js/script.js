// References to ID elements
var cityInput = document.getElementById("cityInput");
var searchButton = document.getElementById("searchButton");

// Variables
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];


function search() {
  var currentCity = cityInput.value;

  // Check to see if there's any input first
  if(currentCity.length != 0) {

    // TO DO:
    // Before adding input to localstorage, we must:
    // 1. Check to see if the input is an actual city (check weather API to verify if there's any data for that place)
    // 2. Check to see if the city has been added already so we don't have duplicates
    searchHistory.push(currentCity);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    console.log(searchHistory);
  }
}



// Add EventListeners to Buttons
searchButton.addEventListener("click", search);
