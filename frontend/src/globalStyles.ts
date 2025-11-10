import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* 1. CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

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

  /* 2. --- THIS IS THE UPDATED THEME CODE --- */
  :root {
    /* Light Theme (Default) */
    --color-primary: #dc2626; /* Red-600 */
    --color-primary-hover: #b91c1c; /* Red-700 */
    --color-background: #ffffff; /* White */
    --color-background-secondary: #f3f4f6; /* Gray-100 */
    --color-text: #111827; /* Gray-900 */
    --color-text-secondary: #6b7280; /* Gray-500 */
    --color-border: #e5e7eb; /* Gray-200 */

    /* New Semantic Colors */
    --color-success: #16a34a; /* Green-600 */
    --color-success-bg: #f0fdf4; /* Green-50 */
    --color-error: #dc2626; /* Red-600 */
    --color-error-bg: #fee2e2; /* Red-50 */
  }

  [data-theme='dark'] {
    /* Dark Theme */
    --color-primary: #f87171; /* Red-400 */
    --color-primary-hover: #ef4444; /* Red-500 */
    --color-background: #111827; /* Gray-900 */
    --color-background-secondary: #1f2937; /* Gray-800 */
    --color-text: #f9fafb; /* Gray-50 */
    --color-text-secondary: #9ca3af; /* Gray-400 */
    --color-border: #374151; /* Gray-700 */

    /* New Semantic Colors (Dark) */
    --color-success: #86efac; /* Green-300 */
    --color-success-bg: #1f2937; /* Gray-800 */
    --color-error: #fca5a5; /* Red-300 */
    --color-error-bg: #1f2937; /* Gray-800 */
  }
  /* 3. Apply themes to body */
  body {
    background-color: var(--color-background);
    color: var(--color-text);
    transition: background-color 0.2s ease, color 0.2s ease;
  }
`;