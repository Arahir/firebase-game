import React, { useEffect, createContext, useState, useContext } from "react";
import {
  useRouteMatch,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import { getGame, addPlayer, changeStep } from "../../api";
import { UserContext } from "../Auth";
import { Game, Player } from "../../types";
import { Selection } from "./Selection";

const GameContext = createContext<Game | null>(null);
export const GameComponent = () => {
  let match = useRouteMatch();
  let { gameId } = useParams();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const user = useContext(UserContext);
  useEffect(() => {
    if (!gameId) {
      return;
    }
    function handleChange(fetchedGame: any) {
      const gameData = fetchedGame.data();
      console.log(gameData);
      const game: Game = {
        id: gameId as string,
        players: gameData?.players || [],
        identities: gameData?.identities || [],
        step: gameData?.step,
        ownerId: gameData?.ownerId
      };
      setCurrentGame(game);
    }

    getGame(gameId, handleChange);
  }, [gameId]);

  useEffect(() => {
    if (currentGame == null || user == null) {
      return;
    }
    addPlayer(currentGame, user);
  }, [currentGame, user]);

  const startGame = () => {
    if (!gameId) {
      return;
    }
    changeStep(gameId, "selection");
  };

  return (
    <GameContext.Provider value={currentGame}>
      <div>
        {(!currentGame || currentGame.step === "pending") && (
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
            {currentGame?.ownerId === user?.uid && (
              <button onClick={startGame}>Démarrer</button>
            )}
          </>
        )}
        {currentGame?.step === "selection" && (
          <Selection game={currentGame} user={user} />
        )}
      </div>
      <Switch>
        <Route path={`${match.path}/waiting`}>
          <div>waiting for</div>
          <Link to={`${match.url}/play`}>Continue</Link>
        </Route>
        <Route path={`${match.path}/play`}>
          <div>
            who are you?
            <input />
            <div>other identities</div>
          </div>
        </Route>
        <Route path={`${match.path}`}></Route>
      </Switch>
    </GameContext.Provider>
  );
};
