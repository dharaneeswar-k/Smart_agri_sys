export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                agri: {
                    bg: 'var(--agri-bg)',
                    card: 'var(--glass-bg)',
                    border: 'var(--glass-border)',
                    text: 'var(--agri-text)',
                    muted: 'var(--agri-muted)',
                    dark: '#0f172a',
                    green: '#10b981',
                    neon: '#34d399',
                    light: '#f8fafc',
                },
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'neon': '0 0 10px rgba(16, 185, 129, 0.5)',
            }
        },
    },
    plugins: [],
}
