import firebase from "firebase";
import { Game, Player } from "./types";

export function createPlayer(user: firebase.User): Player {
  const { photoURL, uid, displayName } = user;
  return {
    userId: uid,
    photoURL: photoURL || "",
    displayName: displayName || ""
  };
}

export function createGame(user: firebase.User) {
  const db = firebase.firestore();

  return db.collection("game").add({
    ownerId: user.uid,
    step: "pending",
    players: [createPlayer(user)]
  });
}

export function getGame(gameId: string, callback: (data: any) => void) {
  const db = firebase.firestore();
  return db
    .collection(`game`)
    .doc(gameId)
    .onSnapshot(callback);
}

export function addPlayer(game: Game, user: firebase.User) {
  const db = firebase.firestore();
  const players = game.players;
  const alreadyIn = players.find((player: Player) => {
    return player.userId === user.uid;
  });

  if (alreadyIn) {
    return Promise.resolve(game);
  }
  console.log(game);
  return db
    .collection("game")
    .doc(game.id)
    .update({
      players: [...game.players, createPlayer(user)]
    });
}

export function changeStep(gameId: string, newStep: string) {
  const db = firebase.firestore();

  return db
    .collection("game")
    .doc(gameId)
    .update({
      step: newStep
    });
}
