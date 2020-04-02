import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from './Auth';
import { createGame } from '../api';

import { Button, Window, WindowContent, WindowHeader } from 'react95';

export const Home: React.FC<any> = props => {
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
    <Window style={{ width: 400, margin: '200px 200px' }}>
      <WindowHeader>Home</WindowHeader>
      <WindowContent>
        <span>Bienvenue sur le Time's Up développé un dimanche par Matthieu Faugère</span>
        <br />
        <br />
        <Button onClick={start}>Créer une partie</Button>
      </WindowContent>
    </Window>
  );
};
