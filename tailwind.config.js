/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        screens: {
            'smd': {'max': '510px'},
            'smw': {'max': '607px'}
        }
    },
    plugins: [],
}
