import { keyBy } from 'lodash';
import React, { useEffect, createContext, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { getGame, addPlayer, changeStep, createGame } from '../../api';
import { UserContext } from '../Auth';
import { Game, Player } from '../../types';
import { Selection } from './Selection';
import { Playing } from './Playing';

import { Avatar, Button, Window, WindowContent, WindowHeader } from 'react95';

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
        ownerId: gameData?.ownerId
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
    if (!gameId) {
      return;
    }
    changeStep(gameId, 'selection');
  };

  return (
    <GameContext.Provider value={currentGame}>
      <Window style={{ width: 500, margin: 100 }}>
        {isInError && (
          <>
            This game does not exist
            <button onClick={restart}>Create a new one?</button>
          </>
        )}
        {currentGame?.step === 'pending' && (
          <>
            <WindowHeader>Liste des joueurs</WindowHeader>
            <WindowContent>
              En attente de joueurs... <br />
              <br />
              {currentGame?.players.map((player: Player) => (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                  <Avatar
                    key={player.photoURL}
                    src={player.photoURL}
                    alt="player img"
                    width="200px"
                    height="auto"
                  />
                  <p style={{ marginLeft: 15 }}>{player.displayName}</p>
                </div>
              ))}
              {currentGame?.ownerId === user?.uid && (currentGame?.players || []).length > 1 && (
                <Button onClick={startGame}>Démarrer</Button>
              )}
            </WindowContent>
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
      </Window>
    </GameContext.Provider>
  );
};
