import { apiSlice } from './apiSlice'; // Import the parent slice
const USERS_URL = '/api/users';

// Define the User type
type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

/**
 * Injects user-specific endpoints into the main apiSlice.
 */
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get all users
    getUsers: builder.query<User[], void>({ // <ReturnType, ArgumentType>
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'], // Caches this data with a 'User' tag
      keepUnusedDataFor: 5,
    }),

    // Query to get a single user's details
    getUserDetails: builder.query<User, string>({ // <User object, userId string>
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Mutation to update a user
    updateUser: builder.mutation<User, Partial<User> & { _id: string }>({
      query: (data) => ({
        url: `${USERS_URL}/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'], // Clears 'User' cache, forces refetch
    }),
    
    // Mutation to delete a user
    deleteUser: builder.mutation<void, string>({ // <void, userId string>
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // --- Add your login/logout mutations here too ---
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
  }),
});

/**
 * Export the auto-generated hooks.
 * Fixing the slice files will make these hooks exist.
 */
export const {
  useGetUsersQuery,
  useGetUserDetailsQuery, // <-- This will now be exported
  useUpdateUserMutation, // <-- This will now be exported
  useDeleteUserMutation,
  useLoginMutation,
  useLogoutMutation,
} = userApiSlice;