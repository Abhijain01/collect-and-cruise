// This new file defines the shape of a User object for our frontend
export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};