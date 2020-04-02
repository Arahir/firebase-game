import { findIndex, some } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Game, Player, Identity } from '../../types';
import { addIdentity, changeStep } from '../../api';

import { Avatar, Button, TextField, WindowHeader, WindowContent } from 'react95';

interface SelectionProps {
  game: Game;
  user: firebase.User | null;
}

export const Selection: React.FC<SelectionProps> = ({ game, user }) => {
  const [pickFor, setPickFor] = useState<Player | null>(null);
  const [identityName, setIdentityName] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  useEffect(() => {
    if (game == null || user == null) {
      return;
    }
    const players = game.players;
    const playerIndex = findIndex(players, (player: Player) => {
      return player.userId === user?.uid;
    });
    const indexToPick = (playerIndex + 1) % players.length;

    setPickFor(players[indexToPick]);
  }, [game, user]);

  useEffect(() => {
    if (game.players.length === game.identities.length) {
      changeStep(game, 'ongoing');
      return;
    }

    const isDoneSelecting = some(game.identities, (identity: Identity) => {
      return identity.pickedBy === user?.uid;
    });

    if (isDoneSelecting) {
      setIsWaiting(true);
    }
  }, [game, user]);

  const validate = () => {
    if (user && pickFor && identityName.length > 0) {
      addIdentity(game, user.uid, pickFor, identityName);
    }
  };

  return (
    <>
      <WindowHeader>Sélection</WindowHeader>

      {!isWaiting ? (
        <WindowContent>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Sélectionne une identité pour
            <Avatar
              style={{ marginLeft: 10, marginRight: 10 }}
              src={pickFor?.photoURL}
              alt="player img"
              width="200px"
              height="auto"
            />
            {pickFor?.displayName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField style={{ flexGrow: '1' }} onChange={e => setIdentityName(e.target.value)} />
            <Button onClick={validate} disabled={identityName.length === 0}>
              Valider
            </Button>
          </div>
        </WindowContent>
      ) : (
        <WindowContent>
          <h2>En attente des autres joueurs</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Vous avez choisi <b>{identityName}</b> pour
            <Avatar
              style={{ marginLeft: 10, marginRight: 10 }}
              src={pickFor?.photoURL}
              alt="player img"
              width="200px"
              height="auto"
            />{' '}
            {pickFor?.displayName}
          </div>
        </WindowContent>
      )}
    </>
  );
};
