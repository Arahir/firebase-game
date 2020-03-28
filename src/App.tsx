import firebase from "firebase";
import React from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";

import { useAuth, UserContext } from "./Components/Auth";
import "./App.css";
import { Game } from "./Components/GameModule/Game";

// Configure Firebase.
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
            <div>Home</div>
            <Link to="/game/12">Créer</Link>
          </Route>
        </Switch>
        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
