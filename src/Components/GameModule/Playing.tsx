import React, { useEffect, useState } from 'react';
import { keyBy } from 'lodash';
import { Game, Identity } from '../../types';
import { foundAnswer, changeStep } from '../../api';

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

    if (allFound) {
      changeStep(game.id, 'done');
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
      <input onChange={e => setAnswer(e.target.value)} />
      <button onClick={validate} disabled={answer.length === 0}>
        valider
      </button>
      {isInError && <h2>Faux! Essaye encore</h2>}
      <p>
        C'est au tour de:
        <img src={game.players[game.currentPlayerIdx || 0].photoURL} alt="player url" />
      </p>
      <ul>
        {game.identities.map((identity: Identity) => (
          <li key={identity.pickedFor}>
            {players[identity.pickedFor].displayName}{' '}
            {(identity.found || identity.pickedFor !== user?.uid) && `- ${identity.name}`}{' '}
            {identity.found && '- trouvé'}
          </li>
        ))}
      </ul>
    </>
  );
};
