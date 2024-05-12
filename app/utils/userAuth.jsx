import { useEffect, useState } from "react";
import { auth } from "../firebase-config";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthInitialized(true); // Set auth initialization state
    });

    return () => unsubscribe();
  }, []);

  return { isAuthenticated, authInitialized }; // Return both values
};

export default useAuth;
