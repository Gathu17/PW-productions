/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "pw-green": {
                    500: "#10B981", // Emerald-500
                    600: "#059669", // Emerald-600
                    700: "#047857", // Emerald-700
                },
                "pw-black": {
                    900: "#111827", // Gray-900
                    800: "#1F2937", // Gray-800
                },
            },
            animation: {
                "fade-in": "fadeIn 1s ease-in-out",
                "slide-up": "slideUp 0.5s ease-out",
                "pulse-slow": "pulse 3s infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};
