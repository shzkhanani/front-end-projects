// script.js

// Function to initialize event listeners
function init() {
    // Add click event listener to the search icon if the search icon exists
    const searchIcon = document.getElementById('search-icon'); //Get the search icon by ID
    if (searchIcon) {
      searchIcon.addEventListener('mouseenter', toggleSearchBar); //Run below fcn when search icon is hovered over
    }
  }
  
  // Function to toggle the search bar visibility
  function toggleSearchBar() {
    const searchContainer = document.querySelector('.search-container');//Looks for the search-container
    const searchInput = document.getElementById('search');//The input field
    if (searchContainer) { //Search box exists
      searchContainer.classList.toggle('active');
      if (searchContainer.classList.contains('active')) {
        searchInput.focus();
      } else { //Search box doesnt exist 
        searchInput.blur();
      }
    }
  }
