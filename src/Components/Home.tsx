import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./Auth";
import { createGame } from "../api";

export const Home: React.FC<any> = props => {
  const user = useContext(UserContext);
  const history = useHistory();
  const start = async () => {
    if (!user) {
      return;
    }
    const game = await createGame(user);
    const gameId = game.id;

    history.push(`game/${gameId}`);
  };

  return (
    <>
      <div>Home</div>
      <button onClick={start}>Créer</button>
    </>
  );
};
