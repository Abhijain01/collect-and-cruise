// frontend/src/globalStyles.ts

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* * 1. Define all our "light mode" colors as CSS variables
   */
  :root {
    --color-background: #ffffff; /* White */
    --color-background-secondary: #f9fafb; /* Light Gray */
    --color-text: #111827; /* Dark Gray */
    --color-text-secondary: #4b5563; /* Medium Gray */
    --color-border: #e5e7eb; /* Light Border */
    --color-primary: #dc2626; /* Red */
    --color-primary-hover: #b91c1c; /* Darker Red */
    --color-dark-surface: #111827; /* Dark Gray (for footer) */
    --color-dark-text: #d1d5db; /* Light Gray (for footer) */
  }

  /* * 2. Define our "dark mode" colors
   * (This 'data-theme' attribute is set by our ThemeContext)
   */
  [data-theme='dark'] {
    --color-background: #111827; /* Dark Gray */
    --color-background-secondary: #1f2937; /* Lighter Dark Gray */
    --color-text: #f9fafb; /* Light Gray */
    --color-text-secondary: #9ca3af; /* Medium Gray */
    --color-border: #374151; /* Dark Border */
    --color-primary: #f87171; /* Light Red */
    --color-primary-hover: #ef4444; /* Medium Red */
    --color-dark-surface: #1f2937; /* Lighter Dark Gray */
    --color-dark-text: #d1d5db; /* Light Gray */
  }

  /* 3. CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
  }

  body {
    /* 4. Use the CSS variables */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    
    background-color: var(--color-background);
    color: var(--color-text);
    
    /* Add a smooth transition for color changes */
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  /* ... (rest of your CSS reset) ... */

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }

  #root {
    isolation: isolate;
  }
`;