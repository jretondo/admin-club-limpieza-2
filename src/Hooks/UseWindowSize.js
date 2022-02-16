import { useEffect, useState } from 'react';

export function useWindowSize() {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        function updateSize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', updateSize);
        updateSize()
        return () => window.removeEventListener('resize', updateSize);
    }, [width]);
    return width;
}