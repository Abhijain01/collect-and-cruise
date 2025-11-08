// frontend/src/hooks/useDebounce.ts

import { useState, useEffect } from 'react';

// This is a "T" (generic) hook. It can debounce any type of value (string, number, etc.)
export function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Update debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // This is the cleanup function.
    // It cancels the timeout if the 'value' changes before the delay is over.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}