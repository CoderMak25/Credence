/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        },
        extend: {
            colors: {
                primary: '#2563EB',
                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444',
                purple: '#8B5CF6',
                accent: '#F3F4F6',
            }
        }
    },
    plugins: [],
}
