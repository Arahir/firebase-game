import React, { useEffect, useState } from 'react';
import { keyBy } from 'lodash';
import { Game, Identity } from '../../types';
import { foundAnswer, changeStep } from '../../api';

import {
  Avatar,
  Button,
  Checkbox,
  Cutout,
  Divider,
  TextField,
  WindowContent,
  WindowHeader
} from 'react95';

interface PlayingProps {
  user: firebase.User | null;
  game: Game;
}

export const Playing: React.FC<PlayingProps> = ({ game, user }) => {
  const [players] = useState(keyBy(game.players, 'userId'));
  const [answer, setAnswer] = useState('');
  const [isInError, setIsInError] = useState(false);
  const [currentPlayerIdentity, setCurrentPlayerIdentity] = useState<Identity | undefined>(
    undefined
  );

  useEffect(() => {
    const currentIdentity = game.identities.find((identity: Identity) => {
      return identity.pickedFor === user?.uid;
    });

    setCurrentPlayerIdentity(currentIdentity);
  }, [game.identities, user]);

  useEffect(() => {
    const allFound = game.identities.every((identity: Identity) => identity.found);
    console.log(game);
    if (allFound) {
      changeStep(game, 'done');
    }
  }, [game]);

  const validate = () => {
    if (answer.toLowerCase() === currentPlayerIdentity?.name.toLowerCase() && user) {
      foundAnswer(game, user?.uid);
      setIsInError(false);
    } else {
      setIsInError(true);
    }
  };

  return (
    <>
      <WindowHeader>Jeu en cours</WindowHeader>
      <WindowContent>
        Qui êtes-vous ?<br />
        <br />
        <div style={{ display: 'flex' }}>
          <TextField style={{ flexGrow: 1 }} onChange={e => setAnswer(e.target.value)} />
          <Button onClick={validate} disabled={answer.length === 0}>
            Valider
          </Button>
        </div>
        {isInError && <h2>Faux! Essaye encore</h2>}
        {game.players[game.currentPlayerIdx as number].userId !== user?.uid ? (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 15, marginBottom: 15 }}>
            C'est au tour de :
            <Avatar
              style={{ marginLeft: 15, marginRight: 15 }}
              src={game.players[game.currentPlayerIdx as number].photoURL}
              alt="player url"
            />
            {game.players[game.currentPlayerIdx as number].displayName}
          </div>
        ) : (
          <h1 style={{ marginTop: 15, marginBottom: 15 }}>C'est votre tour</h1>
        )}
        <ul>
          {game.identities.map((identity: Identity) => (
            <li key={identity.pickedFor}>
              <Cutout style={{ padding: 15, margin: 15, display: 'flex', alignItems: 'center' }}>
                <Avatar style={{ marginRight: 15 }} src={players[identity.pickedFor].photoURL} />
                {players[identity.pickedFor].displayName}{' '}
                <Divider style={{ marginLeft: 15, marginRight: 15 }} vertical />
                <div style={{ flexGrow: 1 }}>
                  {(identity.found || identity.pickedFor !== user?.uid) && `${identity.name}`}
                </div>
                <Checkbox checked={identity.found} readOnly />
              </Cutout>{' '}
            </li>
          ))}
        </ul>
      </WindowContent>
    </>
  );
};
