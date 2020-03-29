import { findIndex } from "lodash";
import React, { useEffect, useState } from "react";
import { Game, Player } from "../../types";

interface SelectionProps {
  game: Game;
  user: firebase.User | null;
}

export const Selection: React.FC<SelectionProps> = ({ game, user }) => {
  const [pickFor, setPickFor] = useState<Player | null>(null);
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

  return (
    <div>
      Select an identity for
      <img
        src={pickFor?.photoURL}
        alt="player img"
        width="200px"
        height="auto"
      />
      <button>Valider</button>
    </div>
  );
};
