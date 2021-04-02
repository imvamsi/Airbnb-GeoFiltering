import { useState, useEffect } from "react";

export function useLocalState<T = undefined>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedValue = window.localStorage.getItem(key);
      if (savedValue) return JSON.parse(savedValue);
      return initialValue;
    }
  });

  useEffect(() => {
    if (window.localStorage)
      window.localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
