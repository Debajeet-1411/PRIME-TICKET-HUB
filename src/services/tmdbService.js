// Enhanced TMDB Service with Pagination and Caching
const TMDB_API_KEY = '860e16eb4d9646b265ca7f5e67b932c3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
const CACHE_KEY = 'tmdb_movies_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Genre mapping
const GENRE_MAP = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western'
};

// Language mapping
const LANGUAGE_MAP = {
    'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil', 'te': 'Telugu',
    'ml': 'Malayalam', 'kn': 'Kannada', 'es': 'Spanish', 'fr': 'French',
    'de': 'German', 'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese'
};

/**
 * Get cached movies from localStorage
 */
function getCachedMovies() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is expired
        if (now - timestamp > CACHE_EXPIRY) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

/**
 * Save movies to localStorage cache
 */
function setCachedMovies(movies) {
    try {
        const cacheData = {
            data: movies,
            timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
}

/**
 * Fetch movies from TMDB by page
 */
export async function fetchTMDBMoviesByPage(page = 1) {
    try {
        const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        return {
            movies: data.results,
            totalPages: data.total_pages,
            currentPage: page
        };
    } catch (error) {
        console.error('Error fetching TMDB movies:', error);
        return { movies: [], totalPages: 0, currentPage: page };
    }
}

/**
 * Fetch movie videos (trailers)
 */
async function fetchMovieVideos(movieId) {
    try {
        const url = `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        const trailer = data.results.find(v =>
            v.type === 'Trailer' && v.site === 'YouTube'
        );

        return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
    } catch (error) {
        return null;
    }
}

/**
 * Fetch movie credits (cast)
 */
async function fetchMovieCredits(movieId) {
    try {
        const url = `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        return data.cast.slice(0, 3).map(actor => ({
            name: actor.name,
            image: actor.profile_path
                ? `${TMDB_IMAGE_BASE}${actor.profile_path}`
                : `https://placehold.co/100x100?text=${encodeURIComponent(actor.name.split(' ')[0])}`
        }));
    } catch (error) {
        return [];
    }
}

/**
 * Fetch movie details (runtime)
 */
async function fetchMovieDetails(movieId) {
    try {
        const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        return { runtime: data.runtime || 120 };
    } catch (error) {
        return { runtime: 120 };
    }
}

/**
 * Convert TMDB movie to local format
 */
export async function convertTMDBMovie(tmdbMovie, startId) {
    try {
        const [trailer, cast, details] = await Promise.all([
            fetchMovieVideos(tmdbMovie.id),
            fetchMovieCredits(tmdbMovie.id),
            fetchMovieDetails(tmdbMovie.id)
        ]);

        const hours = Math.floor(details.runtime / 60);
        const minutes = details.runtime % 60;
        const duration = `${hours}h ${minutes}m`;

        const genres = tmdbMovie.genre_ids
            ? tmdbMovie.genre_ids.slice(0, 2).map(id => GENRE_MAP[id] || 'Drama')
            : ['Drama'];

        const language = LANGUAGE_MAP[tmdbMovie.original_language] || 'English';
        const rating = tmdbMovie.adult ? 'A' : 'UA';

        return {
            id: startId,
            title: tmdbMovie.title || tmdbMovie.original_title,
            genre: genres,
            language: language,
            rating: rating,
            duration: duration,
            poster: tmdbMovie.poster_path
                ? `${TMDB_IMAGE_BASE}${tmdbMovie.poster_path}`
                : `https://placehold.co/300x450?text=${encodeURIComponent(tmdbMovie.title)}`,
            backgroundImage: tmdbMovie.backdrop_path
                ? `${TMDB_BACKDROP_BASE}${tmdbMovie.backdrop_path}`
                : null,
            trailer: trailer || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            description: tmdbMovie.overview || 'No description available.',
            cast: cast.length > 0 ? cast : [
                { name: 'Cast Member', image: 'https://placehold.co/100x100?text=Cast' }
            ]
        };
    } catch (error) {
        console.error('Error converting TMDB movie:', error);
        return null;
    }
}

/**
 * Fetch and convert movies with caching
 */
export async function fetchAndConvertMovies(count = 30, startId = 100) {
    try {
        // Check cache first
        const cached = getCachedMovies();
        if (cached && cached.length >= count) {
            console.log(`Using ${cached.length} cached movies`);
            return cached.slice(0, count);
        }

        console.log(`Fetching ${count} movies from TMDB...`);

        const pages = Math.ceil(count / 20);
        const allTMDBMovies = [];

        for (let page = 1; page <= pages; page++) {
            const { movies } = await fetchTMDBMoviesByPage(page);
            allTMDBMovies.push(...movies);
            if (allTMDBMovies.length >= count) break;
        }

        const convertedMovies = [];
        for (let i = 0; i < Math.min(count, allTMDBMovies.length); i++) {
            const converted = await convertTMDBMovie(allTMDBMovies[i], startId + i);
            if (converted) {
                convertedMovies.push(converted);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Cache the results
        setCachedMovies(convertedMovies);

        console.log(`Successfully converted ${convertedMovies.length} movies`);
        return convertedMovies;
    } catch (error) {
        console.error('Error in fetchAndConvertMovies:', error);
        return [];
    }
}

/**
 * Fetch additional movies for infinite scroll
 */
export async function fetchMoreMovies(currentCount, batchSize = 20) {
    try {
        const cached = getCachedMovies() || [];

        // If we have cached movies beyond current count, use them
        if (cached.length > currentCount) {
            return cached.slice(currentCount, currentCount + batchSize);
        }

        // Otherwise fetch new page
        const page = Math.floor(currentCount / 20) + 1;
        const { movies } = await fetchTMDBMoviesByPage(page);

        const startId = 100 + currentCount;
        const convertedMovies = [];

        for (let i = 0; i < Math.min(batchSize, movies.length); i++) {
            const converted = await convertTMDBMovie(movies[i], startId + i);
            if (converted) {
                convertedMovies.push(converted);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Update cache with new movies
        const updatedCache = [...cached, ...convertedMovies];
        setCachedMovies(updatedCache);

        return convertedMovies;
    } catch (error) {
        console.error('Error fetching more movies:', error);
        return [];
    }
}

/**
 * Group movies by genre
 */
export function groupMoviesByGenre(movies) {
    const grouped = {};

    movies.forEach(movie => {
        const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];

        genres.forEach(genre => {
            if (!grouped[genre]) {
                grouped[genre] = [];
            }
            grouped[genre].push(movie);
        });
    });

    return grouped;
}

/**
 * Search movies from TMDB
 */
export async function searchMovies(query) {
    try {
        if (!query) return [];

        const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`;
        const response = await fetch(url);
        const data = await response.json();

        // Convert first 5 results
        const results = data.results.slice(0, 5);
        const convertedResults = [];

        for (const movie of results) {
            // Basic conversion without full details for speed in dropdown
            const converted = {
                id: 10000 + movie.id, // Offset ID to avoid conflict
                title: movie.title || movie.original_title,
                poster: movie.poster_path
                    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
                    : `https://placehold.co/100x150?text=${encodeURIComponent(movie.title)}`,
                rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
                year: movie.release_date ? movie.release_date.split('-')[0] : '',
                isTMDB: true,
                tmdbId: movie.id
            };
            convertedResults.push(converted);
        }

        return convertedResults;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

/**
 * Fetch single movie by ID (handling the 10000 offset)
 */
export async function fetchMovieById(id) {
    try {
        const numericId = parseInt(id);
        // Check if it's a TMDB ID (we added 10000 offset in search)
        if (numericId < 10000) return null;

        const tmdbId = numericId - 10000;
        const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;

        const response = await fetch(url);
        if (!response.ok) return null;

        const data = await response.json();
        return await convertTMDBMovie(data, numericId);
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        return null;
    }
}
