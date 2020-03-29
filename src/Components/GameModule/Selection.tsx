import { findIndex, some } from "lodash";
import React, { useEffect, useState } from "react";
import { Game, Player, Identity } from "../../types";
import { addIdentity, changeStep } from "../../api";

interface SelectionProps {
  game: Game;
  user: firebase.User | null;
}

export const Selection: React.FC<SelectionProps> = ({ game, user }) => {
  const [pickFor, setPickFor] = useState<Player | null>(null);
  const [identityName, setIdentityName] = useState("");
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
      changeStep(game.id, "ongoing");
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

  return !isWaiting ? (
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
  ) : (
    <div>
      <h2>En attente des autres joueurs</h2>
      <p>
        Vous avez choisi <b>{identityName}</b> pour
        <img
          src={pickFor?.photoURL}
          alt="player img"
          width="200px"
          height="auto"
        />
      </p>
    </div>
  );
};
