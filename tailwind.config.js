/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        screens: {
            'md': {'max': '510px'},
            'sm': {'max': '646px'}
        }
    },
    plugins: [],
}
