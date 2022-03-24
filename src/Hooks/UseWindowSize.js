import { useLayoutEffect, useState } from 'react';

export function useWindowSize() {
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        function updateSize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', updateSize);
        updateSize()
        return () => { window.removeEventListener('resize', updateSize); }
    }, [width]);
    return width;
}