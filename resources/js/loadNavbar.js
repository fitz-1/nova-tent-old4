// Function to load the navbar
function loadNavbar() {
  // Get the navbar container
  const navbarContainer = document.getElementById('navbar-container');
  
  // If the container doesn't exist, create it
  if (!navbarContainer) {
    const header = document.querySelector('header');
    if (header) {
      const container = document.createElement('div');
      container.id = 'navbar-container';
      header.appendChild(container);
    } else {
      console.error('Header element not found');
      return;
    }
  }
  
  // Determine the correct path to the navbar.html file
  let navbarPath = 'resources/components/navbar.html';
  const path = window.location.pathname;
  
  // Check if we're in a subdirectory
  if (path.includes('/pages/')) {
    navbarPath = '../resources/components/navbar.html';
  }
  
  console.log('Loading navbar from:', navbarPath); // Debug log
  
  // Fetch the navbar HTML
  fetch(navbarPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load navbar: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      // Insert the navbar HTML into the container
      const container = document.getElementById('navbar-container');
      if (container) {
        container.innerHTML = html;
        // Fix relative links based on current page location
        fixRelativeLinks();
      } else {
        console.error('Navbar container not found after creation');
      }
    })
    .catch(error => {
      console.error('Error loading navbar:', error);
      // Add a fallback message if navbar fails to load
      const container = document.getElementById('navbar-container');
      if (container) {
        container.innerHTML = '<div style="color: red; padding: 10px;">Error loading navigation. Please refresh the page.</div>';
      }
    });
}

// Function to fix relative links in the navbar
function fixRelativeLinks() {
  const path = window.location.pathname;
  const links = document.querySelectorAll('#navbar-container a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    // Skip external links and anchor links
    if (href.startsWith('http') || href.startsWith('#')) {
      return;
    }
    
    // If we're in a subdirectory, adjust the links
    if (path.includes('/pages/')) {
      // For links to the home page
      if (href === '../index.html') {
        link.setAttribute('href', '../index.html');
      }
      // For links to other pages in the same directory
      else if (href.startsWith('../pages/')) {
        link.setAttribute('href', href);
      }
    }
  });
}

// Load the navbar when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadNavbar); 