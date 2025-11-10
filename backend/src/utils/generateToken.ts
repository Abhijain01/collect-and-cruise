import jwt from 'jsonwebtoken';

// This function ONLY takes the user's ID
// It does NOT take the 'res' (response) object
const generateToken = (id: string) => {
  return jwt.sign(
    { id }, // This is the payload
    process.env.JWT_SECRET as string, // Your secret key from .env
    { expiresIn: '30d' } // The token expires in 30 days
  );
};

export default generateToken;