import React from 'react';
import { Alert } from 'react-bootstrap';

// Define the props for the Message component
interface MessageProps {
  variant?: string; // e.g., 'danger', 'success', 'info'
  children: React.ReactNode; // The content of the message
}

const Message: React.FC<MessageProps> = ({ variant = 'info', children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;