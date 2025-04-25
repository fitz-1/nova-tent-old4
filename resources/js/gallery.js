class Gallery {
  constructor(container) {
    this.container = container;
    this.currentSlide = 0;
    this.currentThumbnailPage = 0;
    this.autoScrollInterval = null;
    this.thumbnailsPerPage = 12;
    
    // Initialize elements
    this.slides = container.querySelectorAll('.slide');
    this.captions = container.querySelectorAll('.slide-caption');
    this.thumbnailContainer = container.querySelector('.thumbnail-container');
    this.prevThumbPageBtn = container.querySelector('#prevThumbPage');
    this.nextThumbPageBtn = container.querySelector('#nextThumbPage');
    this.thumbnailPageInfo = container.querySelector('#thumbnailPageInfo');
    
    // Initialize the first slide and caption
    this.slides[0].classList.add('active');
    this.captions[0].classList.add('active');
    
    // Create thumbnails and start auto-scrolling
    this.createThumbnails();
    this.startAutoScroll();
    
    // Add event listeners
    this.addEventListeners();
  }

  startAutoScroll() {
    this.autoScrollInterval = setInterval(() => this.nextSlide(), 5000);
  }

  pauseAutoScroll() {
    clearInterval(this.autoScrollInterval);
    setTimeout(() => this.startAutoScroll(), 15000); // Resume after 15 seconds
  }

  createThumbnails() {
    this.thumbnailContainer.innerHTML = '';
    this.slides.forEach((slide, index) => {
      const thumbnail = document.createElement('img');
      thumbnail.src = slide.src;
      thumbnail.alt = slide.alt;
      thumbnail.className = 'thumbnail' + (index === this.currentSlide ? ' active' : '');
      thumbnail.onclick = () => {
        this.showSlide(index);
        this.pauseAutoScroll();
      };
      this.thumbnailContainer.appendChild(thumbnail);
    });
    this.updateThumbnailPagination();
  }

  updateThumbnailPagination() {
    const totalPages = Math.ceil(this.slides.length / this.thumbnailsPerPage);
    const startIndex = this.currentThumbnailPage * this.thumbnailsPerPage;
    const endIndex = Math.min(startIndex + this.thumbnailsPerPage, this.slides.length);

    // Show/hide thumbnails based on current page
    const thumbnails = this.thumbnailContainer.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
      thumb.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
    });

    // Update pagination controls
    this.prevThumbPageBtn.disabled = this.currentThumbnailPage === 0;
    this.nextThumbPageBtn.disabled = this.currentThumbnailPage >= totalPages - 1;
    this.thumbnailPageInfo.textContent = `Page ${this.currentThumbnailPage + 1} of ${totalPages}`;
  }

  prevThumbnailPage() {
    if (this.currentThumbnailPage > 0) {
      this.currentThumbnailPage--;
      this.updateThumbnailPagination();
    }
  }

  nextThumbnailPage() {
    const totalPages = Math.ceil(this.slides.length / this.thumbnailsPerPage);
    if (this.currentThumbnailPage < totalPages - 1) {
      this.currentThumbnailPage++;
      this.updateThumbnailPagination();
    }
  }

  showSlide(index) {
    // Hide all slides and captions
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.captions.forEach(caption => caption.classList.remove('active'));
    
    // Show the selected slide and caption
    this.slides[index].classList.add('active');
    this.captions[index].classList.add('active');
    this.currentSlide = index;

    // Update active thumbnail
    const thumbnails = this.thumbnailContainer.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    // Update thumbnail page if needed
    const newThumbnailPage = Math.floor(index / this.thumbnailsPerPage);
    if (newThumbnailPage !== this.currentThumbnailPage) {
      this.currentThumbnailPage = newThumbnailPage;
      this.updateThumbnailPagination();
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(this.currentSlide);
    this.pauseAutoScroll();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(this.currentSlide);
    this.pauseAutoScroll();
  }

  addEventListeners() {
    // Add event listeners for navigation buttons
    const prevBtn = this.container.querySelector('.slideshow-controls:first-child');
    const nextBtn = this.container.querySelector('.slideshow-controls:last-child');
    
    prevBtn.onclick = () => this.prevSlide();
    nextBtn.onclick = () => this.nextSlide();
    
    // Add event listeners for thumbnail pagination
    this.prevThumbPageBtn.onclick = () => this.prevThumbnailPage();
    this.nextThumbPageBtn.onclick = () => this.nextThumbnailPage();
  }
}

// Initialize all galleries on the page
document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('.gallery-section');
  galleries.forEach(gallery => new Gallery(gallery));
}); 