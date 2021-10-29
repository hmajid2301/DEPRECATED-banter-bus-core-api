import MockedServerSocket from 'socket.io-mock';

import roomFactory from '../../../tests/factories/room';
import { RoomController } from '../room_controllers';
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
    const room = roomFactory.build();

    jest.spyOn(RoomService.prototype, 'Create').mockImplementation(() => Promise.resolve(room));
    await roomController.CreateRoom({ gameName: 'fibbing_it' });
  });
});
