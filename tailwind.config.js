/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#1e293b', // Slate 800
                    primary: '#334155', // Slate 700
                    accent: '#ea580c', // Orange 600
                    light: '#f8fafc', // Slate 50
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
