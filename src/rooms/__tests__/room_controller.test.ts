import MockedServerSocket from 'socket.io-mock';

import roomFactory from '../../../tests/factories/room';
import { RoomCreated } from '../room_api_models';
import { RoomController } from '../room_controllers';
import { RoomRepository } from '../room_repository';
import { RoomService } from '../room_service';
import { SetupLogger } from '~/core/logger/logger';
import { ErrorMessage } from '~/types';

describe('Room Controller', () => {
  let roomController: RoomController;
  let socket: any;

  beforeAll(() => {
    const logger = SetupLogger();
    const { username, password, host, port, name, authDB } = {
      username: 'mongodb-memory-server-root',
      password: 'rootuser',
      host: 'localhost',
      port: 5133,
      name: 'banterbus',
      authDB: 'admin',
    };

    const roomRepository = new RoomRepository(username, password, host, port, name, authDB);
    const roomService = new RoomService(roomRepository, 'http://localhost');
    socket = new MockedServerSocket();
    roomController = new RoomController(roomService, logger, socket.socketClient);
  });

  test('Create a room ', async () => {
    socket.on('ROOM_CREATED', (roomCreated: RoomCreated) => {
      const { roomCode, roomID } = roomCreated;
      expect(roomCode).toMatch(/^[A-Z]{0,5}$/);
      expect(roomID).toBeTruthy();
    });

    const room = roomFactory.build();
    jest.spyOn(RoomService.prototype, 'Create').mockImplementation(() => Promise.resolve(room));
    await roomController.CreateRoom({ gameName: 'fibbing_it' });
  });

  test('Fail to create a room ', async () => {
    socket.on('ERROR', (error: ErrorMessage) => {
      const { code, message } = error;
      expect(code).toBe('room_created_failure');
      expect(message).toBe('Failed to create room');
    });

    jest.spyOn(RoomService.prototype, 'Create').mockImplementation(() => Promise.reject(new Error('Random error')));
    await roomController.CreateRoom({ gameName: 'fibbing_it' });
  });
});
