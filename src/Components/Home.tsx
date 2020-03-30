import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth, UserContext } from './Auth';
import { createGame } from '../api';
import styled from 'styled-components';

const CreateButton = styled.button`
  padding: 20px 40px;
  background-color: #ff0050;
  border-radius: 30px;
  border: none;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  &:hover {
  }
`;

export const Home: React.FC<any> = props => {
  // const isSignedIn = useAuth();
  const user = useContext(UserContext);
  const history = useHistory();
  const start = async () => {
    if (!user) {
      return;
    }
    const game = await createGame(user);
    history.push(`game/${game.id}`);
  };

  return (
    <>
      <div>Home</div>
      <CreateButton onClick={start}>Créer une partie</CreateButton>
    </>
  );
};
