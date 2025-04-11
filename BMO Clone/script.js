function init() {
  const searchIcon = document.getElementById('search-icon'); // Get the search icon by ID
  if (searchIcon) {
      searchIcon.addEventListener('mouseenter', toggleSearchBar); // When hovered over, run the function
  }
}

function toggleSearchBar() {
  const searchContainer = document.querySelector('.search-container'); // Get the container
  if (searchContainer) {
      searchContainer.classList.toggle('active'); // Toggle the 'active' class
  }
}

// Initialize the event listener when the DOM content is loaded
window.addEventListener('DOMContentLoaded', init);