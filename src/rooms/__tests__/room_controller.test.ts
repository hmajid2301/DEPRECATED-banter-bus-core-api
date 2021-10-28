import MockedServerSocket from 'socket.io-mock';

import { RoomController } from '../room_controllers';
import { GameState, Room } from '../room_models';
import { RoomService } from '../room_service';
import { SetupLogger } from '~/core/logger/logger';

describe('Room Controller', () => {
  let roomController: RoomController;

  beforeAll(() => {
    const logger = SetupLogger();
    const socket = new MockedServerSocket();
    roomController = new RoomController(
      'mongodb-memory-server-root',
      'rootuser',
      'localhost',
      5133,
      'banterbus',
      'admin',
      'http://localhost',
      logger,
      socket.socketClient,
    );
  });

  test('Create a room ', async () => {
    const createdAt = new Date();
    const room: Room = {
      id: 'abc',
      gameName: 'fibbing_it',
      roomCode: 'ABCDE',
      state: GameState.CREATED,
      createdAt,
      updatedAt: createdAt,
    };

    jest.spyOn(RoomService.prototype, 'Create').mockImplementation(() => Promise.resolve(room));
    await roomController.CreateRoom({ gameName: 'fibbing_it' });
  });
});
