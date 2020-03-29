import firebase from "firebase";
import React from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { useAuth, UserContext } from "./Components/Auth";
import "./App.css";
import { GameComponent as Game } from "./Components/GameModule/Game";
import { Home } from "./Components/Home";

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: "lifen-game"
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

function App() {
  const { isSignedIn, user } = useAuth();
  return !isSignedIn ? (
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  ) : (
    <UserContext.Provider value={user}>
      <Router>
        <Switch>
          <Route path="/game/:gameId">
            <Game />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
