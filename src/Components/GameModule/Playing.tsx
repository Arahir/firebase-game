import React, { useEffect, useState } from "react";
import { keyBy } from "lodash";
import { Game, Player, Identity } from "../../types";

interface PlayingProps {
  user: firebase.User | null;
  game: Game;
}

export const Playing: React.FC<PlayingProps> = ({ game, user }) => {
  const [players, setPlayers] = useState(keyBy(game.players, "userId"));

  return (
    <ul>
      {game.identities.map((identity: Identity) => (
        <li key={identity.pickedFor}>
          {players[identity.pickedFor].displayName}{" "}
          {identity.pickedFor !== user?.uid && `- ${identity.name}`}{" "}
          {identity.found && "- trouvé"}
        </li>
      ))}
    </ul>
  );
};
