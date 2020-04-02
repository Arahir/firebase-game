import firebase from 'firebase';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import { themes, reset } from 'react95';

import { useAuth, UserContext } from './Components/Auth';
import './App.css';
import { GameComponent as Game } from './Components/GameModule/Game';
import { Home } from './Components/Home';
import Layout from './Components/Layout';

const GlobalStyle = createGlobalStyle`
  ${reset}
`;

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: 'lifen-game'
  // ...
};
firebase.initializeApp(config);

function App() {
  const { user } = useAuth();
  return (
    <UserContext.Provider value={user}>
      <ThemeProvider theme={themes.default}>
        <GlobalStyle />
        <Router>
          <Layout>
            <Switch>
              <Route path="/game/:gameId">
                <Game />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
