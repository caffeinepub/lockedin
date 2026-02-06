import { useEffect, useState } from 'react';

export type AccentPreset = 'gold' | 'blue' | 'purple' | 'green';

const ACCENT_PRESETS: Record<AccentPreset, { 
  primary: string; 
  secondary: string; 
  label: string;
  brand: string;
  brandForeground: string;
  ring: string;
  link: string;
  selection: string;
}> = {
  gold: {
    primary: '0.72 0.15 60',
    secondary: '0.60 0.18 240',
    label: 'Gold & Blue',
    brand: '0.72 0.15 60',
    brandForeground: '0.145 0 0',
    ring: '0.72 0.15 60',
    link: '0.72 0.15 60',
    selection: '0.72 0.15 60',
  },
  blue: {
    primary: '0.60 0.18 240',
    secondary: '0.55 0.20 200',
    label: 'Ocean Blue',
    brand: '0.60 0.18 240',
    brandForeground: '0.145 0 0',
    ring: '0.60 0.18 240',
    link: '0.60 0.18 240',
    selection: '0.60 0.18 240',
  },
  purple: {
    primary: '0.65 0.22 300',
    secondary: '0.70 0.18 330',
    label: 'Purple Haze',
    brand: '0.65 0.22 300',
    brandForeground: '0.145 0 0',
    ring: '0.65 0.22 300',
    link: '0.65 0.22 300',
    selection: '0.65 0.22 300',
  },
  green: {
    primary: '0.68 0.18 150',
    secondary: '0.62 0.16 180',
    label: 'Forest Green',
    brand: '0.68 0.18 150',
    brandForeground: '0.145 0 0',
    ring: '0.68 0.18 150',
    link: '0.68 0.18 150',
    selection: '0.68 0.18 150',
  },
};

const STORAGE_KEY = 'lockedin-accent-preset';

export function useAccentPreset() {
  const [preset, setPresetState] = useState<AccentPreset>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as AccentPreset) || 'gold';
  });

  useEffect(() => {
    const colors = ACCENT_PRESETS[preset];
    
    // Set semantic tokens that drive interactive elements
    document.documentElement.style.setProperty('--brand', colors.brand);
    document.documentElement.style.setProperty('--brand-foreground', colors.brandForeground);
    document.documentElement.style.setProperty('--ring', colors.ring);
    document.documentElement.style.setProperty('--link', colors.link);
    document.documentElement.style.setProperty('--selection', colors.selection);
    
    // Keep legacy variables for backward compatibility with lockedin-bg
    document.documentElement.style.setProperty('--accent-gold', colors.primary);
    document.documentElement.style.setProperty('--accent-blue', colors.secondary);
  }, [preset]);

  const setPreset = (newPreset: AccentPreset) => {
    setPresetState(newPreset);
    localStorage.setItem(STORAGE_KEY, newPreset);
  };

  return {
    preset,
    setPreset,
    presets: ACCENT_PRESETS,
    availablePresets: Object.keys(ACCENT_PRESETS) as AccentPreset[],
  };
}
