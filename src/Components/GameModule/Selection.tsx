import { findIndex } from "lodash";
import React, { useEffect, useState } from "react";
import { Game, Player } from "../../types";
import { addIdentity, changeStep } from "../../api";

interface SelectionProps {
  game: Game;
  user: firebase.User | null;
}

export const Selection: React.FC<SelectionProps> = ({ game, user }) => {
  const [pickFor, setPickFor] = useState<Player | null>(null);
  const [identityName, setIdentityName] = useState("");
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
      changeStep(game.id, "ongoing");
    }
  }, [game]);

  const validate = () => {
    if (user && pickFor && identityName.length > 0) {
      addIdentity(game, user.uid, pickFor, identityName);
    }
  };

  return (
    <div>
      Select an identity for
      <img
        src={pickFor?.photoURL}
        alt="player img"
        width="200px"
        height="auto"
      />
      <input onChange={e => setIdentityName(e.target.value)} />
      <button onClick={validate} disabled={identityName.length === 0}>
        Valider
      </button>
    </div>
  );
};
