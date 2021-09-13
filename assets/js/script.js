// References to ID elements
var searchButton = document.getElementById("searchButton");

// Other variables
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];


function search() {
  var cityInput = document.getElementById("cityInput");
  var currentCity = cityInput.value;

  // Check to see if there's any input first
  if(currentCity.length != 0) {

    // TO DO:
    // Before adding input to localstorage, we must:
    // 1. Check to see if the input is an actual city (check weather API to verify if there's any data for that place)
    // 2. Check to see if the city has been added already so we don't have duplicates
    searchHistory.push(currentCity);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    showHistory();
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

    // Add the appropriate classes for styling
    listItem.classList.add("list-group-item");

    // If the city is the current search, add the "active" class
    if(i == searchHistory.length - 1) {
      listItem.classList.add("active");
    }

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

showHistory();

// Add EventListeners to Buttons
searchButton.addEventListener("click", search);
