import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [corresponde, setCorresponde] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const aoMudar = (e: MediaQueryListEvent) => setCorresponde(e.matches);
    mql.addEventListener('change', aoMudar);
    setCorresponde(mql.matches);
    return () => mql.removeEventListener('change', aoMudar);
  }, [query]);

  return corresponde;
}
