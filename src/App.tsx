import React from "react";
import "./App.css";
import firebase, { User } from "firebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import { useAuth, UserContext } from "./Components/Auth";
// Configure Firebase.
console.log(process.env);
const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain
  // ...
};
firebase.initializeApp(config);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};

const NameComposant = ({ name }: { name: string }) => <h1>{name}</h1>;
function App() {
  const { isSignedIn, user } = useAuth();
  return !isSignedIn ? (
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  ) : (
    <UserContext.Provider value={user}>
      <NameComposant name={user?.displayName || ""} />
      <img src={user?.photoURL || ""} />
      <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    </UserContext.Provider>
  );
}

export default App;
