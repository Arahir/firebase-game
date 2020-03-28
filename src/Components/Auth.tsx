// Import FirebaseAuth and firebase.
import React from "react";
import firebase, { User } from "firebase";

export const UserContext = React.createContext<User | null>(null);

export const useAuth = () => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      setUser(user);
    });

    return () => {
      unregisterAuthObserver();
    };
  }, []);
  return { isSignedIn, user };
};
