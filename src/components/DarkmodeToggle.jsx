import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        return 'light';
    });

    const updateFavicon = (isDark) => {
        const favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) return;

        if (isDark) {
            fetch(favicon.href)
                .then(response => response.text())
                .then(data => {
                    const whiteFavicon = data.replace(/fill="currentColor"/g, 'fill="white"');
                    const blob = new Blob([whiteFavicon], { type: 'image/svg+xml' });
                    favicon.href = URL.createObjectURL(blob);
                })
                .catch(console.error);
        } else {
            favicon.href = '/favicon.svg';
        }
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            updateFavicon(true);
        } else {
            document.documentElement.classList.remove('dark');
            updateFavicon(false);
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-800 dark:text-white" />
            ) : (
                <Sun className="w-5 h-5 text-gray-800 dark:text-white" />
            )}
        </button>
    );
};

export default DarkModeToggle;