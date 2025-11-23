import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for infinite scroll
 */
export function useInfiniteScroll(callback, hasMore) {
    const [isFetching, setIsFetching] = useState(false);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isFetching) {
            setIsFetching(true);
            callback().finally(() => setIsFetching(false));
        }
    }, [callback, hasMore, isFetching]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '200px',
            threshold: 0.1
        };

        observerRef.current = new IntersectionObserver(handleObserver, options);

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver]);

    return { isFetching, sentinelRef };
}
