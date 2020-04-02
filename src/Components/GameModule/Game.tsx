import { keyBy } from 'lodash';
import React, { useEffect, createContext, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { getGame, addPlayer, changeStep, createGame } from '../../api';
import { UserContext } from '../Auth';
import { Game, Player } from '../../types';
import { Selection } from './Selection';
import { Playing } from './Playing';

const GameContext = createContext<Game | null>(null);
export const GameComponent = () => {
  let { gameId } = useParams();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isInError, setIsInError] = useState(false);
  const user = useContext(UserContext);
  const history = useHistory();
  const restart = async () => {
    if (!user) {
      return;
    }
    if (isInError) {
      setIsInError(false);
    }
    const game = await createGame(user);
    const gameId = game.id;

    history.push(`/game/${gameId}`);
  };
  useEffect(() => {
    if (!gameId || !user) {
      return;
    }
    function handleChange(fetchedGame: any) {
      if (!fetchedGame.exists) {
        setIsInError(true);
        return;
      }
      const gameData = fetchedGame.data();

      if (gameData.step !== 'pending') {
        const players = keyBy(gameData.players, 'userId');
        if (!players[(user as firebase.User).uid]) {
          setIsInError(true);
        }
      }

      const game: Game = {
        id: gameId as string,
        players: gameData?.players || [],
        identities: gameData?.identities || [],
        step: gameData?.step,
        ownerId: gameData?.ownerId,
        currentPlayerIdx: gameData?.currentPlayerIdx
      };
      setCurrentGame(game);
    }

    function handleError() {
      setIsInError(true);
    }

    getGame(gameId, handleChange, handleError);
  }, [gameId, user]);

  useEffect(() => {
    if (isInError || currentGame == null || user == null) {
      return;
    }
    addPlayer(currentGame, user);
  }, [currentGame, user, isInError]);

  const startGame = () => {
    if (!gameId || (currentGame?.players?.length || 0) < 2) {
      return;
    }

    changeStep(currentGame as Game, 'selection');
  };

  return (
    <GameContext.Provider value={currentGame}>
      <div>
        {isInError && (
          <>
            This game does not exist
            <button onClick={restart}>Create a new one?</button>
          </>
        )}
        {currentGame?.step === 'pending' && (
          <>
            <div>Players</div>
            {currentGame?.players.map((player: Player) => (
              <img
                key={player.photoURL}
                src={player.photoURL}
                alt="player img"
                width="200px"
                height="auto"
              />
            ))}
            {currentGame?.ownerId === user?.uid && (currentGame?.players || []).length > 1 && (
              <button onClick={startGame}>Démarrer</button>
            )}
          </>
        )}
        {currentGame?.step === 'selection' && <Selection game={currentGame} user={user} />}
        {currentGame?.step === 'ongoing' && <Playing game={currentGame} user={user} />}
        {currentGame?.step === 'done' && (
          <>
            <h1>All done</h1>
            <button onClick={restart}>New game?</button>
          </>
        )}
      </div>
    </GameContext.Provider>
  );
};
