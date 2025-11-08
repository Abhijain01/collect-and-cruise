import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base query
const baseQuery = fetchBaseQuery({
  baseUrl: '', // Your API's base URL, if it has one
  credentials: 'include', // This is for sending cookies
});

// --- THIS IS THE FIX ---
// The 'export' keyword MUST be here.
// This is the "parent" API slice.
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Product', 'Order'], // Define global tags for caching
  endpoints: () => ({}), // Endpoints are injected from other files
});