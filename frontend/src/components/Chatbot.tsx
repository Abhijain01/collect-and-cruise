import { useState, useRef, useEffect, FormEvent } from 'react';
import styled from 'styled-components';
import { Bot, X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

// --- Styled Components ---

// --- FIX 1: The "1% Fix" ---
// This container is now "click-through" so it
// won't block the footer links underneath it.
const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  pointer-events: none; /* <-- This is the main fix */
`;
// -------------------------

// The floating action button
const ChatButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
  pointer-events: auto; /* <-- Clicks work on the button */

  &:hover {
    transform: scale(1.1);
    background-color: var(--color-primary-hover);
  }
`;

// The chat window that opens
const ChatWindow = styled.div<{ $isOpen: boolean }>`
  width: 370px;
  height: 500px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto; /* <-- Clicks also work on the window */
  
  /* Show/Hide Animation */
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(20px)')};
  transition: all 0.3s ease;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  background: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  &:hover { color: var(--color-text); }
`;

const MessageList = styled.div`
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Message = styled.div<{ $isUser: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  max-width: 80%;
  font-size: 0.95rem;
  line-height: 1.5;

  ${props => props.$isUser && `
    background-color: var(--color-primary);
    color: white;
    border-bottom-right-radius: 0.375rem;
    align-self: flex-end;
  `}

  ${props => !props.$isUser && `
    background-color: var(--color-background-secondary);
    color: var(--color-text);
    border-bottom-left-radius: 0.375rem;
    align-self: flex-start;
  `}
`;

const InputForm = styled.form`
  display: flex;
  border-top: 1px solid var(--color-border);
  padding: 0.75rem;
  gap: 0.5rem;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  border: 1px solid var(--color-border);
  background: var(--color-background-secondary);
  color: var(--color-text);
  border-radius: 99px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: var(--color-primary);
  }
`;

const SendButton = styled.button`
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--color-primary-hover);
  }
`;

// --- Component Logic ---
interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hello! I'm your AI assistant for Collect & Cruise. How can I help you today?", sender: 'ai' }
  ]);
  
  const { userInfo } = useAuth();
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const getMockAiResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('hello') || msg.includes('hi')) {
      return `Hi ${userInfo?.email || 'there'}! What can I help you with? You can ask about products, shipping, or your orders.`;
    }
    if (msg.includes('product') || msg.includes('hotwheel') || msg.includes('car')) {
      return "We sell a wide range of diecast cars, including 'Mainline', 'Premium', and 'Exclusive' models. You can see them all on our 'Shop' page!";
    }
    if (msg.includes('shipping') || msg.includes('delivery')) {
      return "We offer standard shipping (5-7 business days) and express shipping (1-2 business days). All orders are packed with care.";
    }
    if (msg.includes('order') || msg.includes('cart')) {
      return "You can check your cart by clicking the cart icon in the header. To see past orders, you'll need to go to your account page (coming soon!).";
    }
    if (msg.includes('admin') || msg.includes('upload')) {
      return "The Admin Upload page is for administrators to add new products to our inventory. Are you an admin?";
    }
    return "I'm sorry, I'm not sure how to help with that. Try asking about 'products', 'shipping', or 'orders'.";
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    const aiResponseText = getMockAiResponse(input);
    const aiMessage: ChatMessage = {
      id: Date.now() + 1,
      text: aiResponseText,
      sender: 'ai',
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
    }, 800);

    setInput('');
  };

  return (
    <ChatbotContainer>
      {/* The Chat Window */}
      <ChatWindow $isOpen={isOpen}>
        <ChatHeader>
          <h3>Collect & Cruise AI</h3>
          <CloseButton onClick={() => setIsOpen(false)}>
            <X size={20} />
          </CloseButton>
        </ChatHeader>
        
        <MessageList ref={messageListRef}>
          {messages.map(msg => (
            <Message key={msg.id} $isUser={msg.sender === 'user'}>
              {msg.text}
            </Message>
          ))}
        </MessageList>
        
        <InputForm onSubmit={handleSend}>
          <ChatInput
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <SendButton type="submit">
            <Send size={20} />
          </SendButton>
        </InputForm>
      </ChatWindow>
      
      {/* The Chat Button */}
      <ChatButton onClick={() => setIsOpen(!isOpen)} aria-label="Toggle chat">
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </ChatButton>
    </ChatbotContainer>
  );
};

export default Chatbot;