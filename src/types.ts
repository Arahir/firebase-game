export interface Player {
  userId: string;
  photoURL: string;
  displayName: string;
}

export interface Identity {
  name: string;
  pickedBy: string;
  pickedFor: string;
  found: boolean;
}

export interface Game {
  id: string;
  ownerId: string;
  step: string;
  players: Player[];
  identities: Identity[];
}
