import { useEffect, useState } from "react";
import { auth } from "../firebase-config";

// Function to get the current user ID
const useCurrentUserId = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Firebase Auth state change listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user.uid); // Set the current user's UID in state
      } else {
        // User is signed out
        setCurrentUser(null);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, [auth]); // Dependency array includes auth object

  return currentUser; // Return the current user's ID
};

export default useCurrentUserId;
