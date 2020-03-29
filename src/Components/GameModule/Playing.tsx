import React, { useEffect, useState } from "react";
import { keyBy } from "lodash";
import { Game, Identity } from "../../types";
import { foundAnswer, changeStep } from "../../api";

interface PlayingProps {
  user: firebase.User | null;
  game: Game;
}

export const Playing: React.FC<PlayingProps> = ({ game, user }) => {
  const [players] = useState(keyBy(game.players, "userId"));
  const [answer, setAnswer] = useState("");
  const [currentPlayerIdentity, setCurrentPlayerIdentity] = useState<
    Identity | undefined
  >(undefined);

  useEffect(() => {
    const currentIdentity = game.identities.find((identity: Identity) => {
      return identity.pickedFor === user?.uid;
    });

    setCurrentPlayerIdentity(currentIdentity);
  }, [game.identities, user]);

  useEffect(() => {
    const allFound = game.identities.every(
      (identity: Identity) => identity.found
    );

    if (allFound) {
      changeStep(game.id, "done");
    }
  }, [game]);

  const validate = () => {
    if (answer === currentPlayerIdentity?.name && user) {
      foundAnswer(game, user?.uid);
    }
  };

  return (
    <>
      <input onChange={e => setAnswer(e.target.value)} />
      <button onClick={validate} disabled={answer.length === 0}>
        valider
      </button>
      <ul>
        {game.identities.map((identity: Identity) => (
          <li key={identity.pickedFor}>
            {players[identity.pickedFor].displayName}{" "}
            {(identity.found || identity.pickedFor !== user?.uid) &&
              `- ${identity.name}`}{" "}
            {identity.found && "- trouvé"}
          </li>
        ))}
      </ul>
    </>
  );
};
