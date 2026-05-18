import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light';
export type Appearance = 'light';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (_mode: Appearance) => void;
};

const listeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

const applyTheme = (): void => {
    if (typeof document === 'undefined') {
        return;
    }

    // Always force light mode
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

export function initializeTheme(): void {
    applyTheme();
}

export function useAppearance(): UseAppearanceReturn {
    useSyncExternalStore(
        subscribe,
        () => 'light',
        () => 'light',
    );

    const updateAppearance = (): void => {
        applyTheme();
        notify();
    };

    return {
        appearance: 'light',
        resolvedAppearance: 'light',
        updateAppearance,
    } as const;
}