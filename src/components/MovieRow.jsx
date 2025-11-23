import React, { useRef } from 'react';
import MovieCard from './MovieCard';

const MovieRow = ({ movies, id }) => {
    const rowRef = useRef(null);

    const handleMouseEnter = (e) => {
        const container = rowRef.current;
        const item = e.currentTarget;

        if (!container || !item) return;

        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const itemWidth = 174; // 160px width + 14px gap
        const scrollAmount = itemWidth * 5;

        // Check if item is near the right edge of the visible area
        // We use a threshold (e.g., within 20px of the edge or partially cut off)
        const isNearRightEdge = itemRect.right >= containerRect.right - 20;

        // Check if item is near the left edge
        const isNearLeftEdge = itemRect.left <= containerRect.left + 20;

        if (isNearRightEdge) {
            // Scroll right
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            const targetScroll = Math.min(container.scrollLeft + scrollAmount, maxScrollLeft);

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        } else if (isNearLeftEdge) {
            // Scroll left
            const targetScroll = Math.max(container.scrollLeft - scrollAmount, 0);

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div
            ref={rowRef}
            className="movie-row"
            id={id}
        >
            {movies.map((movie) => (
                <div
                    key={movie.id}
                    className="movie-item"
                    onMouseEnter={handleMouseEnter}
                >
                    <MovieCard movie={movie} />
                </div>
            ))}
        </div>
    );
};

export default MovieRow;
