import { useEffect, useState } from "react";

const useLocalStorage = (key, fallback) => {
  const [value, setValue] = useState(
    JSON.parse(window.localStorage.getItem(key)) ?? fallback
  );

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};
export default useLocalStorage;
