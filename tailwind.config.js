/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Vibrant blue for primary actions/highlights
        secondary: '#2563EB', // Slightly darker blue
        accent: '#EC4899', // Pink, keeping for potential use
        background: '#F8FAFC', // Very light blue-gray for overall page background
        surface: '#FFFFFF', // Pure white for cards and main content areas
        text: '#1F2937', // Dark gray for primary text
        textSecondary: '#6B7280', // Medium gray for secondary text/labels
        border: '#E5E7EB', // Light gray for borders
        success: '#10B981', // Green
        warning: '#F59E0B', // Yellow/Orange
        error: '#EF4444', // Red
      },
    },
  },
  plugins: [],
};
