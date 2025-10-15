const themes = {
    default: {
        '--main-purple': '#7c3aed',
        '--accent-purple': '#a855f7',
        '--main-bg': 'linear-gradient(135deg, #1e3a8a 0%, #5b21b6 100%)',
        '--main-card': '#1f2937',
        '--main-border': '#374151',
        '--main-text': '#f9fafb',
        '--accent-text': '#d1d5db',
        particleColors: ["#7c3aed", "#a855f7", "#FFFFFF"]
    },
    navy: {
        '--main-purple': '#3b82f6',
        '--accent-purple': '#60a5fa',
        '--main-bg': '#1e3a8a',
        '--main-card': '#1e40af',
        '--main-border': '#2563eb',
        '--main-text': '#eff6ff',
        '--accent-text': '#dbeafe',
        particleColors: ["#3b82f6", "#60a5fa", "#FFFFFF"]
    },
    purple: {
        '--main-purple': '#9333ea',
        '--accent-purple': '#a855f7',
        '--main-bg': '#4c1d95',
        '--main-card': '#581c87',
        '--main-border': '#6b21a8',
        '--main-text': '#f5d0fe',
        '--accent-text': '#e9d5ff',
        particleColors: ["#9333ea", "#a855f7", "#FFFFFF"]
    },
    pink: {
        '--main-purple': '#ec4899',
        '--accent-purple': '#f472b6',
        '--main-bg': '#9d174d',
        '--main-card': '#831843',
        '--main-border': '#be185d',
        '--main-text': '#fce7f3',
        '--accent-text': '#fbcfe8',
        particleColors: ["#ec4899", "#f472b6", "#FFFFFF"]
    },
    gray: {
        '--main-purple': '#6b7280',
        '--accent-purple': '#9ca3af',
        '--main-bg': '#1f2937',
        '--main-card': '#374151',
        '--main-border': '#4b5563',
        '--main-text': '#f9fafb',
        '--accent-text': '#e5e7eb',
        particleColors: ["#6b7280", "#9ca3af", "#FFFFFF"]
    },
    white: {
        '--main-purple': '#7c3aed',
        '--accent-purple': '#a855f7',
        '--main-bg': '#ffffff',
        '--main-card': '#f9fafb',
        '--main-border': '#e5e7eb',
        '--main-text': '#111827',
        '--accent-text': '#374151',
        particleColors: ["#7c3aed", "#a855f7", "#111827"]
    }
};

export function setTheme(themeName) {
    const selectedTheme = themes[themeName] || themes.default;
    for (const [property, value] of Object.entries(selectedTheme)) {
        if (property !== 'particleColors') {
            document.documentElement.style.setProperty(property, value);
        }
    }
    window.particleColors = selectedTheme.particleColors;
    if (window.initParticles) {
        window.initParticles();
    }
    localStorage.setItem('pulse-theme', themeName);
}

export function loadTheme() {
    const savedTheme = localStorage.getItem('pulse-theme') || 'default';
    setTheme(savedTheme);
}
