import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouteState {
  path: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouteState | undefined>(undefined);

export function getEffectivePath(): string {
  if (typeof window === 'undefined') return '/';

  // 1. Query parameter check: ?admin or ?page=admin or ?admin=true
  try {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('admin') || searchParams.get('page') === 'admin') {
      return '/admin';
    }
    const pageParam = searchParams.get('page');
    if (pageParam) {
      return pageParam.startsWith('/') ? pageParam : `/${pageParam}`;
    }
  } catch {}

  // 2. Hash check: #admin, #/admin, #/product/:slug
  if (window.location.hash) {
    const cleanHash = window.location.hash.replace(/^#\/?/, '/');
    if (cleanHash === '/admin' || cleanHash.startsWith('/admin')) {
      return '/admin';
    }
    if (cleanHash && cleanHash !== '/') {
      return cleanHash;
    }
  }

  // 3. Pathname check
  const pathname = window.location.pathname || '/';
  return pathname;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(getEffectivePath);

  useEffect(() => {
    const syncRoute = () => {
      setPath(getEffectivePath());
    };

    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);

    // Global keyboard shortcut: Ctrl+Shift+A or Alt+A to open Admin Portal instantly
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigate = (newPath: string) => {
    // Normalise path
    const targetPath = newPath.startsWith('/') ? newPath : `/${newPath}`;

    // Clean any trailing hash or query if navigating to clean path
    if (window.location.pathname !== targetPath || window.location.hash || window.location.search) {
      try {
        window.history.pushState({}, '', targetPath);
      } catch {
        // Fallback to hash if pushState fails in certain restricted iframe environments
        window.location.hash = targetPath;
      }
      setPath(targetPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
