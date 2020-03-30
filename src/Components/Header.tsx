import firebase from 'firebase';
import React from 'react';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { useAuth, UserContext } from '../Components/Auth';

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

const NavBar = styled.div`
  height: 100px;
  background-color: #12130f;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0px 15px;
  justify-content: space-between;
`;

const Avatar = styled.img`
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin-right: 10px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
`;

export default () => {
  const history = useHistory();

  const { isSignedIn, user } = useAuth();
  console.log(user);
  const isHomePage = history.location.pathname === '/';
  const goHome = () => {
    if (isHomePage) {
      return;
    }
    history.push('/');
  };
  return (
    <NavBar>
      <strong onClick={goHome}>WhoAmI?!</strong>
      {isSignedIn ? (
        <>
          <Profile>
            {user?.photoURL && <Avatar src={user.photoURL} alt="photoUrl"></Avatar>}
            <p>{user?.displayName ? user.displayName : user?.email && user.email}</p>
          </Profile>

          <button onClick={() => firebase.auth().signOut()}>Déconnexion</button>
        </>
      ) : (
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      )}
    </NavBar>
  );
};
