// TMDB API Movie Fetcher and Merger
// This script fetches movies from TMDB API and merges with local movies.json

const TMDB_API_KEY = '860e16eb4d9646b265ca7f5e67b932c3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

/**
 * Fetch local movies from movies.json
 */
async function fetchLocalMovies() {
    try {
        const response = await fetch('./movies.json');
        if (!response.ok) {
            throw new Error(`Failed to load local movies: ${response.status}`);
        }
        const movies = await response.json();
        console.log(`✅ Loaded ${movies.length} local movies`);
        return movies;
    } catch (error) {
        console.error('❌ Error loading local movies:', error);
        return [];
    }
}

/**
 * Fetch popular movies from TMDB API
 */
async function fetchApiMovies(page = 1) {
    try {
        const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Fetched ${data.results.length} movies from TMDB API`);
        return data.results;
    } catch (error) {
        console.error('❌ Error fetching from TMDB API:', error);
        return [];
    }
}

/**
 * Fetch movie details including runtime and trailer
 */
async function fetchMovieDetails(movieId) {
    try {
        // Fetch movie details
        const detailsUrl = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        const details = await detailsResponse.json();

        // Fetch videos (trailers)
        const videosUrl = `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
        const videosResponse = await fetch(videosUrl);
        const videos = await videosResponse.json();

        // Find official trailer
        const trailer = videos.results.find(v =>
            v.type === 'Trailer' && v.site === 'YouTube'
        );

        // Fetch credits for cast
        const creditsUrl = `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`;
        const creditsResponse = await fetch(creditsUrl);
        const credits = await creditsResponse.json();

        return {
            runtime: details.runtime,
            trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
            cast: credits.cast.slice(0, 3) // Top 3 cast members
        };
    } catch (error) {
        console.error(`❌ Error fetching details for movie ${movieId}:`, error);
        return { runtime: null, trailer: null, cast: [] };
    }
}

/**
 * Convert TMDB API movie object to local JSON format
 */
async function convertApiMovie(apiMovie, startId) {
    try {
        // Fetch additional details
        const details = await fetchMovieDetails(apiMovie.id);

        // Convert runtime to hours and minutes
        const duration = details.runtime
            ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
            : '2h 0m';

        // Map genres (TMDB uses genre IDs, we'll use common genre names)
        const genreMap = {
            28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
            80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
            14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
            9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
            53: 'Thriller', 10752: 'War', 37: 'Western'
        };

        const genres = apiMovie.genre_ids
            ? apiMovie.genre_ids.slice(0, 2).map(id => genreMap[id] || 'Drama')
            : ['Drama'];

        // Determine language
        const languageMap = {
            'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil', 'te': 'Telugu',
            'ml': 'Malayalam', 'kn': 'Kannada', 'es': 'Spanish', 'fr': 'French',
            'de': 'German', 'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese'
        };

        const language = languageMap[apiMovie.original_language] || 'English';

        // Determine rating (map TMDB adult flag to rating)
        const rating = apiMovie.adult ? 'A' : 'UA';

        // Convert cast
        const cast = details.cast.map(actor => ({
            name: actor.name,
            image: actor.profile_path
                ? `${TMDB_IMAGE_BASE}${actor.profile_path}`
                : `https://placehold.co/100x100?text=${encodeURIComponent(actor.name.split(' ')[0])}`
        }));

        return {
            id: startId,
            title: apiMovie.title || apiMovie.original_title,
            genre: genres,
            language: language,
            rating: rating,
            duration: duration,
            poster: apiMovie.poster_path
                ? `${TMDB_IMAGE_BASE}${apiMovie.poster_path}`
                : `https://placehold.co/300x450?text=${encodeURIComponent(apiMovie.title)}`,
            backgroundImage: apiMovie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${apiMovie.backdrop_path}`
                : null,
            trailer: details.trailer || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: apiMovie.overview || 'No description available.',
            cast: cast.length > 0 ? cast : [
                {
                    name: 'Cast Member',
                    image: 'https://placehold.co/100x100?text=Cast'
                }
            ]
        };
    } catch (error) {
        console.error('❌ Error converting movie:', error);
        return null;
    }
}

/**
 * Merge local and API movies, avoiding duplicates
 */
function mergeMovies(localMovies, apiMovies) {
    try {
        // Create a Set of existing movie titles (lowercase for comparison)
        const existingTitles = new Set(
            localMovies.map(m => m.title.toLowerCase())
        );

        // Filter out API movies that already exist locally
        const newMovies = apiMovies.filter(movie =>
            movie && !existingTitles.has(movie.title.toLowerCase())
        );

        // Merge arrays
        const merged = [...localMovies, ...newMovies];

        console.log(`✅ Merged ${localMovies.length} local + ${newMovies.length} new = ${merged.length} total movies`);
        return merged;
    } catch (error) {
        console.error('❌ Error merging movies:', error);
        return localMovies;
    }
}

/**
 * Render movies to the DOM
 */
function renderMovies(movies) {
    const container = document.getElementById('movie-list');

    if (!container) {
        console.error('❌ Container #movie-list not found');
        return;
    }

    if (!movies || movies.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No movies to display</p>';
        return;
    }

    container.innerHTML = movies.map(movie => `
        <div class="movie-card" style="
            background: #2a2a2a;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
            cursor: pointer;
        ">
            <img 
                src="${movie.poster}" 
                alt="${movie.title}"
                style="width: 100%; height: 400px; object-fit: cover;"
                onerror="this.src='https://placehold.co/300x450?text=${encodeURIComponent(movie.title)}'"
            />
            <div style="padding: 1rem;">
                <h3 style="color: white; margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                    ${movie.title}
                </h3>
                <p style="color: #ff6b6b; margin: 0 0 0.5rem 0; font-size: 0.9rem;">
                    ${Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #b0b0b0; font-size: 0.85rem;">
                        ${movie.language}
                    </span>
                    <span style="color: #2dc492; font-size: 0.85rem;">
                        ${movie.duration}
                    </span>
                </div>
            </div>
        </div>
    `).join('');

    console.log(`✅ Rendered ${movies.length} movies to the DOM`);
}

/**
 * Main function to orchestrate the entire process
 */
async function main() {
    try {
        console.log('🎬 Starting movie fetch and merge process...');

        // Show loading state
        const container = document.getElementById('movie-list');
        if (container) {
            container.innerHTML = '<p style="text-align: center; color: white;">Loading movies...</p>';
        }

        // Step 1: Fetch local movies
        const localMovies = await fetchLocalMovies();

        // Step 2: Fetch API movies
        const apiMoviesRaw = await fetchApiMovies(1);

        // Step 3: Convert API movies to local format
        const startId = localMovies.length > 0
            ? Math.max(...localMovies.map(m => m.id)) + 1
            : 1;

        console.log('🔄 Converting API movies to local format...');
        const apiMoviesConverted = [];

        // Convert first 10 movies (to avoid too many API calls)
        for (let i = 0; i < Math.min(10, apiMoviesRaw.length); i++) {
            const converted = await convertApiMovie(apiMoviesRaw[i], startId + i);
            if (converted) {
                apiMoviesConverted.push(converted);
            }
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Step 4: Merge movies
        const allMovies = mergeMovies(localMovies, apiMoviesConverted);

        // Step 5: Render movies
        renderMovies(allMovies);

        console.log('✅ Process complete!');
        return allMovies;

    } catch (error) {
        console.error('❌ Fatal error in main process:', error);
        const container = document.getElementById('movie-list');
        if (container) {
            container.innerHTML = `
                <p style="text-align: center; color: #ff6b6b;">
                    Error loading movies. Please check the console for details.
                </p>
            `;
        }
    }
}

// Add CSS for grid layout
const style = document.createElement('style');
style.textContent = `
    #movie-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
        padding: 2rem;
        background: #1a1a1a;
        min-height: 100vh;
    }
    
    .movie-card:hover {
        transform: translateY(-5px);
    }
    
    @media (max-width: 768px) {
        #movie-list {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
            padding: 1rem;
        }
    }
`;
document.head.appendChild(style);

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchLocalMovies,
        fetchApiMovies,
        convertApiMovie,
        mergeMovies,
        renderMovies,
        main
    };
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
