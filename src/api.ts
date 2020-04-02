import firebase from 'firebase';
import { random } from 'lodash';
import { Game, Player, Identity } from './types';

export function createPlayer(user: firebase.User): Player {
  const { photoURL, uid, displayName } = user;
  return {
    userId: uid,
    photoURL: photoURL || '',
    displayName: displayName || ''
  };
}

export function createIdentity(name: string, pickedBy: string, pickedFor: string) {
  return {
    found: false,
    pickedBy,
    pickedFor,
    name
  };
}

export function createGame(user: firebase.User) {
  const db = firebase.firestore();

  return db.collection('game').add({
    ownerId: user.uid,
    step: 'pending',
    players: [createPlayer(user)],
    currentPlayerIdx: 0
  });
}

export function getGame(
  gameId: string,
  callbackSuccess: (data: any) => void,
  callbackError: () => void
) {
  const db = firebase.firestore();
  return db
    .collection(`game`)
    .doc(gameId)
    .onSnapshot(callbackSuccess, callbackError);
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

  return db
    .collection('game')
    .doc(game.id)
    .update({
      players: [...game.players, createPlayer(user)]
    });
}

export function changeStep(game: Game, newStep: string) {
  const db = firebase.firestore();
  const update: { step: string; currentPlayerIdx?: number } = {
    step: newStep
  };
  if (newStep === 'selection') {
    const playerPosition = random((game?.players.length as number) - 1);
    update.currentPlayerIdx = playerPosition;
    console.log(update);
  }
  return db
    .collection('game')
    .doc(game.id)
    .update(update);
}

export function addIdentity(game: Game, userId: string, pickedFor: Player, identityName: string) {
  const db = firebase.firestore();

  return db
    .collection('game')
    .doc(game.id)
    .update({
      identities: [...game.identities, createIdentity(identityName, userId, pickedFor.userId)]
    });
}

export function foundAnswer(game: Game, userId: string) {
  const db = firebase.firestore();
  const updatedIdentities = game.identities.map((identity: Identity) => {
    if (identity.pickedFor === userId) {
      return { ...identity, found: true };
    }

    return identity;
  });

  return db
    .collection('game')
    .doc(game.id)
    .update({
      identities: updatedIdentities
    });
}
