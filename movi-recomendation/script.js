
const API_KEY = '447b74e6eb693e9945da01e6ff54b17e'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';


const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieGrid = document.getElementById('movie-grid');
const genreFilter = document.getElementById('genre-filter');
const yearFilter = document.getElementById('year-filter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const modal = document.getElementById('movie-modal');
const closeBtn = document.querySelector('.close-btn');
const modalContent = document.getElementById('modal-content');

// State
let currentPage = 1;
let totalPages = 1;
let currentSearchTerm = '';
let currentGenre = '';
let currentYear = '';
let genres = [];

// Initialize the app
async function init() {
    await fetchGenres();
    populateYearFilter();
    fetchPopularMovies();
    
    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    genreFilter.addEventListener('change', (e) => {
        currentGenre = e.target.value;
        currentPage = 1;
        if (currentSearchTerm) {
            searchMovies();
        } else {
            fetchPopularMovies();
        }
    });
    
    yearFilter.addEventListener('change', (e) => {
        currentYear = e.target.value;
        currentPage = 1;
        if (currentSearchTerm) {
            searchMovies();
        } else {
            fetchPopularMovies();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            if (currentSearchTerm) {
                searchMovies();
            } else {
                fetchPopularMovies();
            }
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            if (currentSearchTerm) {
                searchMovies();
            } else {
                fetchPopularMovies();
            }
        }
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Fetch popular movies
async function fetchPopularMovies() {
    try {
        let url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${currentPage}`;
        
        if (currentGenre) {
            url += `&with_genres=${currentGenre}`;
        }
        
        if (currentYear) {
            url += `&primary_release_year=${currentYear}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        totalPages = data.total_pages;
        updatePagination();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Search movies
async function searchMovies() {
    try {
        if (!currentSearchTerm.trim()) {
            fetchPopularMovies();
            return;
        }
        
        let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(currentSearchTerm)}&page=${currentPage}`;
        
        if (currentGenre) {
            url += `&with_genres=${currentGenre}`;
        }
        
        if (currentYear) {
            url += `&primary_release_year=${currentYear}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        totalPages = data.total_pages;
        updatePagination();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

// Handle search
function handleSearch() {
    currentSearchTerm = searchInput.value.trim();
    currentPage = 1;
    
    if (currentSearchTerm) {
        searchMovies();
    } else {
        fetchPopularMovies();
    }
}

// Display movies
function displayMovies(movies) {
    movieGrid.innerHTML = '';
    
    if (movies.length === 0) {
        movieGrid.innerHTML = '<p class="no-results">No movies found. Try a different search.</p>';
        return;
    }
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Poster'}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-details">
                    <span>${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
                    <span>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        `;
        
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        movieGrid.appendChild(movieCard);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const movie = await response.json();
        
        modalContent.innerHTML = `
            <div class="movie-detail">
                <div class="movie-detail-header">
                    <img src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${movie.title}" class="movie-detail-poster">
                    <div class="movie-detail-info">
                        <h2 class="movie-detail-title">${movie.title}</h2>
                        <div class="movie-detail-meta">
                            <span>${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
                            <span>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                            <span>${movie.runtime ? `${movie.runtime} mins` : 'N/A'}</span>
                        </div>
                        <div class="movie-detail-genres">
                            ${movie.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                        </div>
                        <p class="movie-detail-overview">${movie.overview || 'No overview available.'}</p>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Fetch genres
async function fetchGenres() {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        genres = data.genres;
        
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// Populate year filter
function populateYearFilter() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
}

// Update pagination
function updatePagination() {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Initialize the app
init();