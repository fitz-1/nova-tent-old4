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
  
  console.log('Loading navbar from:', navbarPath);
  
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
        
        // Initialize mobile menu
        initializeMobileMenu();
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

// Function to initialize mobile menu
function initializeMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuBtn || !navLinks) {
    console.error('Menu elements not found');
    return;
  }

  // Handle mobile menu button
  menuBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
    
    // Reset dropdowns when menu opens/closes
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
        const menu = dropdown.querySelector('.dropdown-menu, .iteration-menu');
        if (menu) {
          menu.style.display = 'none';
          menu.style.opacity = '0';
        }
      });
    }
  });

  // Handle dropdown toggles
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      const dropdown = toggle.closest('.dropdown');
      const isIterations = dropdown.classList.contains('iterations');
      
      if (window.innerWidth <= 768) {
        // On mobile, iterations is just a link
        if (isIterations) {
          return; // Let the link work normally
        }
        
        // For other dropdowns on mobile
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('active');
            const menu = d.querySelector('.dropdown-menu, .iteration-menu');
            if (menu) {
              menu.style.display = 'none';
              menu.style.opacity = '0';
            }
          }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
        const menu = dropdown.querySelector('.dropdown-menu, .iteration-menu');
        if (menu) {
          menu.style.display = dropdown.classList.contains('active') ? 'block' : 'none';
          menu.style.opacity = dropdown.classList.contains('active') ? '1' : '0';
        }
      } else {
        // On desktop, let the hover CSS handle the dropdown
        if (isIterations) {
          return; // Let the link work normally
        }
        
        // For other dropdowns on desktop
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('active');
          }
        });
        
        dropdown.classList.toggle('active');
      }
    });
  });

  // Handle all navigation links
  const navLinksElements = document.querySelectorAll('.nav-links a');
  navLinksElements.forEach(link => {
    if (!link.classList.contains('dropdown-toggle')) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          // Close menu when a link is clicked
          document.querySelector('.nav-links').classList.remove('active');
          menuBtn.classList.remove('active');
          document.querySelectorAll('.dropdown').forEach(d => {
            d.classList.remove('active');
            const menu = d.querySelector('.dropdown-menu');
            if (menu) {
              menu.style.display = 'none';
            }
          });
        }
      });
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuBtn.classList.remove('active');
      document.querySelectorAll('.dropdown').forEach(d => {
        d.classList.remove('active');
        const menu = d.querySelector('.dropdown-menu');
        if (menu) {
          menu.style.display = 'none';
        }
      });
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