import firebase from 'firebase';
import React from 'react';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { useHistory } from 'react-router-dom';

import { AppBar, Avatar, Button, Toolbar } from 'react95';

import { useAuth } from '../Components/Auth';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};

export default () => {
  const history = useHistory();

  const { isSignedIn, user } = useAuth();
  const isHomePage = history.location.pathname === '/';
  const goHome = () => {
    if (isHomePage) {
      return;
    }
    history.push('/');
  };
  return (
    <AppBar>
      <Toolbar>
        <strong onClick={goHome}>WhoAmI?!</strong>
        {isSignedIn ? (
          <>
            <div>
              {user?.photoURL && <Avatar src={user.photoURL} alt="photoUrl"></Avatar>}
              <p>{user?.displayName ? user.displayName : user?.email && user.email}</p>
            </div>

            <Button onClick={() => firebase.auth().signOut()}>Déconnexion</Button>
          </>
        ) : (
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        )}
      </Toolbar>
    </AppBar>
  );
};
