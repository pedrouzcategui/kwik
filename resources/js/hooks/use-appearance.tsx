import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system' | 'slack' | 'matrix' | 'synthwave' | 'honeymustard';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const THEME_CLASSES: Appearance[] = ['light', 'dark', 'slack', 'matrix', 'synthwave', 'honeymustard'];

const applyTheme = (appearance: Appearance) => {
    let themeToApply: Appearance = appearance;
    if (appearance === 'system') {
        themeToApply = prefersDark() ? 'dark' : 'light';
    }

    // Remove all theme classes first
    THEME_CLASSES.forEach((theme) => {
        document.documentElement.classList.remove(theme);
    });

    // Add the selected theme class
    console.log(`Applying theme: ${themeToApply}`);
    document.documentElement.classList.add(themeToApply);
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

export function initializeTheme() {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';
    applyTheme(savedAppearance);
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);
        localStorage.setItem('appearance', mode);
        setCookie('appearance', mode);
        applyTheme(mode);
        // Force update of the cookie immediately for SSR or backend usage if needed
        document.cookie = `appearance=${mode};path=/;SameSite=Lax`;
    }, []);

    useEffect(() => {
        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
        updateAppearance(savedAppearance || 'system');
        return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}
