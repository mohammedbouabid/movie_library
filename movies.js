// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const allMoviesList = document.getElementById('allMoviesList');
const favoritesList = document.getElementById('favoritesList');
const categoryLinks = document.querySelectorAll('.dropdown-content a[data-category]');
const movieModal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');

// State variables
let currentFilter = 'all';
let currentSearchTerm = '';

// Movies data with enhanced information
let movies = [
    {
        id: 1,
        title: "Inception",
        director: "Christopher Nolan",
        year: 2010,
        favorite: false,
        genre: "Action, Sci-Fi",
        category: "action",
        description: "Un voleur qui s'infiltre dans les rêves des gens pour voler leurs secrets se voit confier la mission inverse : implanter une idée dans l'esprit d'un PDG.",
        poster: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRRyuWmayVBvqjd1MxTKpRgauq2cCtUzb7Q9QvaFTkAuxAU_EYMoCE3wBuJeftxIzf0grreIw",
        actors: [
            {
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Leonardo_Dicaprio_Cannes_2019.jpg/250px-Leonardo_Dicaprio_Cannes_2019.jpg",
                actor_name: "Leonardo DiCaprio",
                character_name: "Dom Cobb",
            },
            {
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Marion_Cotillard_Cannes_2018.jpg/250px-Marion_Cotillard_Cannes_2018.jpg",
                actor_name: "Marion Cotillard",
                character_name: "Mal",
            }
        ],
    },
    {
        id: 2,
        title: "Interstellar",
        director: "Christopher Nolan",
        year: 2014,
        favorite: false,
        genre: "Adventure, Drama, Sci-Fi",
        category: "sci-fi",
        description: "Dans un futur proche, la Terre se meurt. Un groupe d'explorateurs entreprend le voyage le plus important de l'histoire de l'humanité au-delà de notre galaxie.",
        poster: "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SL1500_.jpg",
        actors: [
            {
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Matthew_McConaughey_2019_%2848648344772%29.jpg/250px-Matthew_McConaughey_2019_%2848648344772%29.jpg",
                actor_name: "Matthew McConaughey",
                character_name: "Cooper",
            },
            {
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Anne_Hathaway_in_2017.jpg/250px-Anne_Hathaway_in_2017.jpg",
                actor_name: "Anne Hathaway",
                character_name: "Dr. Brand",
            }
        ],
    },
    {
        id: 3,
        title: "The Matrix",
        director: "Wachowski Sisters",
        favorite: false,
        year: 1999,
        genre: "Action, Sci-Fi",
        category: "action",
        description: "Un programmeur informatique découvre que la réalité telle qu'il la connaît n'est qu'une simulation informatique appelée la Matrice.",
        poster: "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg",
        actors: [
            {
                image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR-USyI8VIxs8XSqJ5JOPwSEobozghRsN5yMgvLg7Ev9qfttsnjsPgyEpa7je9OHdgf3C-arTy8eFAVJpqTrNTt2A",
                actor_name: "Keanu Reeves",
                character_name: "Neo",
            },
            {
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Carrie-Anne_Moss_2013.jpg/250px-Carrie-Anne_Moss_2013.jpg",
                actor_name: "Carrie-Anne Moss",
                character_name: "Trinity",
            }
        ],
    }
];

// Initialize the app
document.addEventListener("DOMContentLoaded", function() {
    loadMoviesFromStorage();
    setupEventListeners();
    setupNavbar();
    renderMovies();
});

// Load movies from localStorage
function loadMoviesFromStorage() {
    const storedMovies = localStorage.getItem('arkx_movies');
    if (storedMovies) {
        movies = JSON.parse(storedMovies);
    } else {
        // Save initial movies to localStorage
        saveMoviesToStorage();
    }
}

// Save movies to localStorage
function saveMoviesToStorage() {
    localStorage.setItem('arkx_movies', JSON.stringify(movies));
}

// Setup all event listeners
function setupEventListeners() {
    // Search functionality
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        } else {
            // Real-time search as user types
            debounce(handleSearch, 300)();
        }
    });

    // Category filtering
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            handleCategoryFilter(category);
        });
    });

    // Modal close events
    closeBtn.addEventListener('click', closeModal);
    movieModal.addEventListener('click', (e) => {
        if (e.target === movieModal) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !movieModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search functionality
function handleSearch() {
    currentSearchTerm = searchInput.value.toLowerCase().trim();
    renderMovies();
}

// Handle category filtering
function handleCategoryFilter(category) {
    currentFilter = category;
    currentSearchTerm = ''; // Clear search when filtering by category
    searchInput.value = '';
    renderMovies();
}

// Filter movies based on current filter and search term
function getFilteredMovies() {
    let filteredMovies = movies;

    // Apply category filter
    if (currentFilter !== 'all') {
        filteredMovies = filteredMovies.filter(movie => 
            movie.category === currentFilter
        );
    }

    // Apply search filter
    if (currentSearchTerm) {
        filteredMovies = filteredMovies.filter(movie =>
            movie.title.toLowerCase().includes(currentSearchTerm) ||
            movie.director.toLowerCase().includes(currentSearchTerm) ||
            movie.genre.toLowerCase().includes(currentSearchTerm)
        );
    }

    return filteredMovies;
}

// Get favorite movies
function getFavoriteMovies() {
    return movies.filter(movie => movie.favorite);
}

// Create movie card HTML
function createMovieCard(movie) {
    return `
        <div class="movie-item" data-id="${movie.id}">
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/350x280/1e293b/64748b?text=Image+Non+Disponible'">
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p class="director">Réalisateur: ${movie.director}</p>
                <p class="genre">${movie.genre}</p>
                
                
                <div class="movie-buttons">
                    <button class="like-btn ${movie.favorite ? 'liked' : ''}" data-id="${movie.id}">
                        ${movie.favorite ? "❤️ Aimé" : "🤍 J'aime"}
                    </button>
                    <button class="details-btn" data-id="${movie.id}">
                        ℹ️ Détails
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Display movies in container
function displayMovies(container, moviesToDisplay, emptyMessage = '') {
    if (moviesToDisplay.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-film"></i>
                <h3>Aucun film trouvé</h3>
                <p>${emptyMessage || 'Aucun film ne correspond à vos critères.'}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = moviesToDisplay.map(movie => createMovieCard(movie)).join('');
    
    // Add event listeners to the new buttons
    setupMovieCardListeners(container);
}

// Setup event listeners for movie cards
function setupMovieCardListeners(container) {
    // Like buttons
    container.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = parseInt(e.target.getAttribute('data-id'));
            toggleFavorite(movieId);
        });
    });

    // Details buttons
    container.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = parseInt(e.target.getAttribute('data-id'));
            showMovieDetails(movieId);
        });
    });
}

// Toggle favorite status
function toggleFavorite(movieId) {
    const movieIndex = movies.findIndex(movie => movie.id === movieId);
    if (movieIndex !== -1) {
        movies[movieIndex].favorite = !movies[movieIndex].favorite;
        saveMoviesToStorage();
        renderMovies();
        
        // Show feedback
        showNotification(
            movies[movieIndex].favorite 
                ? `"${movies[movieIndex].title}" ajouté aux favoris!` 
                : `"${movies[movieIndex].title}" retiré des favoris!`
        );
    }
}

// Show movie details in modal
function showMovieDetails(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${movie.title} <span class="modal-year">(${movie.year})</span></h2>
        </div>
        <div class="modal-main">
            <div class="modal-poster">
                <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/180x270/1e293b/64748b?text=Image+Non+Disponible'">
            </div>
            <div class="modal-info">
                <p><strong>Réalisateur:</strong> ${movie.director}</p>
                <p><strong>Année:</strong> ${movie.year}</p>
                <p><strong>Genre:</strong> ${movie.genre}</p>
                <p><strong>Statut:</strong> ${movie.favorite ? '❤️ Dans les favoris' : '🤍 Pas dans les favoris'}</p>
            </div>
        </div>
        <div class="modal-description">
            <h3>Synopsis</h3>
            <p>${movie.description}</p>
        </div>
        ${movie.actors && movie.actors.length > 0 ? `
        <div class="modal-cast">
            <h3>Distribution</h3>
            <ul>
                ${movie.actors.map(actor => `
                    <li>
                        <img src="${actor.image}" alt="${actor.actor_name}" onerror="this.src='https://via.placeholder.com/40x40/1e293b/64748b?text=?'">
                        <div>
                            <strong>${actor.actor_name}</strong> dans le rôle de <em>${actor.character_name}</em>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
        ` : ''}
    `;

    movieModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close modal
function closeModal() {
    movieModal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Render all movies and favorites
function renderMovies() {
    const filteredMovies = getFilteredMovies();
    const favoriteMovies = getFavoriteMovies();

    // Update section titles based on current filter/search
    const allMoviesSection = document.querySelector('.movies-section h2');
    if (currentSearchTerm) {
        allMoviesSection.textContent = `Résultats de recherche pour "${currentSearchTerm}"`;
    } else if (currentFilter !== 'all') {
        const categoryName = getCategoryDisplayName(currentFilter);
        allMoviesSection.textContent = `Films ${categoryName}`;
    } else {
        allMoviesSection.textContent = 'Tous les Films';
    }

    // Display movies
    displayMovies(
        allMoviesList, 
        filteredMovies,
        currentSearchTerm 
            ? `Aucun film ne correspond à "${currentSearchTerm}"`
            : currentFilter !== 'all' 
                ? `Aucun film dans la catégorie ${getCategoryDisplayName(currentFilter)}`
                : 'Aucun film disponible'
    );

    displayMovies(
        favoritesList, 
        favoriteMovies,
        'Vous n\'avez pas encore de films favoris. Cliquez sur le bouton "J\'aime" pour en ajouter!'
    );
}

// Get display name for category
function getCategoryDisplayName(category) {
    const categoryNames = {
        'action': 'd\'Action',
        'comedy': 'de Comédie',
        'drama': 'Dramatiques',
        'sci-fi': 'de Science-Fiction'
    };
    return categoryNames[category] || category;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Setup navbar functionality
function setupNavbar() {
    // Navbar active state
    const navLinks = document.querySelectorAll('.nav-links a:not(.dropbtn)');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.hasAttribute('data-category')) {
                navLinks.forEach(lnk => lnk.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            const dropdowns = document.getElementsByClassName('dropdown-content');
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                openDropdown.style.display = 'none';
            }
        }
    });

    // Toggle dropdown menu
    const dropbtn = document.querySelector('.dropbtn');
    if (dropbtn) {
        dropbtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.nextElementSibling;
            const isVisible = dropdown.style.display === 'block';
            
            // Close all dropdowns first
            const allDropdowns = document.getElementsByClassName('dropdown-content');
            for (let i = 0; i < allDropdowns.length; i++) {
                allDropdowns[i].style.display = 'none';
            }
            
            // Toggle current dropdown
            dropdown.style.display = isVisible ? 'none' : 'block';
        });
    }
}

// Add some utility functions for future enhancements
function addMovie(movieData) {
    const newId = Math.max(...movies.map(m => m.id)) + 1;
    const newMovie = {
        id: newId,
        favorite: false,
        ...movieData
    };
    movies.push(newMovie);
    saveMoviesToStorage();
    renderMovies();
    return newMovie;
}

function removeMovie(movieId) {
    const movieIndex = movies.findIndex(movie => movie.id === movieId);
    if (movieIndex !== -1) {
        const removedMovie = movies.splice(movieIndex, 1)[0];
        saveMoviesToStorage();
        renderMovies();
        return removedMovie;
    }
    return null;
}

function updateMovie(movieId, updates) {
    const movieIndex = movies.findIndex(movie => movie.id === movieId);
    if (movieIndex !== -1) {
        movies[movieIndex] = { ...movies[movieIndex], ...updates };
        saveMoviesToStorage();
        renderMovies();
        return movies[movieIndex];
    }
    return null;
}

// Export functions for potential external use
window.MovieApp = {
    addMovie,
    removeMovie,
    updateMovie,
    toggleFavorite,
    showMovieDetails,
    renderMovies,
    getFilteredMovies,
    getFavoriteMovies
};

