import { useCallback, useEffect, useState } from 'react';

/**
 * Safe JSON parse helper.
 */
function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/**
 * Safe JSON stringify helper.
 */
function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

/**
 * A React hook for localStorage-based persistence.
 * Initializes from localStorage, updates when value changes.
 * Returns [value, setValue].
 */
// PUBLIC_INTERFACE
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null || item === undefined) return initialValue;
      return safeParse(item, initialValue);
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, safeStringify(valueToStore));
        }
      } catch {
        // ignore write errors
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
