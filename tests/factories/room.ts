import { Factory } from 'fishery';
import { v4 } from 'uuid';

import { GameState, Room } from '~/rooms/room_models';

const gameNames = ['fibbing_it', 'quibly', 'drawlosssuem'];

function generateRandomRoomCode(): string {
  let roomCode = '';
  const roomCodeLen = 5;
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < roomCodeLen; i += 1) {
    const randomChar = validChars.charAt(Math.floor(Math.random() * validChars.length));
    roomCode += randomChar;
  }

  return roomCode;
}

export default Factory.define<Room>(() => ({
  id: v4(),
  gameName: gameNames[Math.floor(Math.random() * gameNames.length)],
  roomCode: generateRandomRoomCode(),
  state: GameState.CREATED,
  players: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}));
