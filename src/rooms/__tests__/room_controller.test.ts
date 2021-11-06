import MockedServerSocket from 'socket.io-mock';

import roomFactory from '../../../tests/factories/room';
import { RoomCreated } from '../room_api_models';
import { RoomController } from '../room_controllers';
import { RoomRepository } from '../room_repository';
import { RoomService } from '../room_service';
import HttpClient from '~/clients/management_api/HttpClient';
import { IAPIConfiguration } from '~/clients/management_api/IAPIConfiguration';
import { GameService } from '~/clients/management_api/api/game.service';
import { Log } from '~/core/logger';
import { ErrorMessage } from '~/types';

describe('Room Controller', () => {
  let roomController: RoomController;
  let socket: any;

  beforeAll(() => {
    const { username, password, host, port, name, authDB } = {
      username: 'mongodb-memory-server-root',
      password: 'rootuser',
      host: 'localhost',
      port: 5133,
      name: 'banterbus',
      authDB: 'admin',
    };

    const apiConfiguration: IAPIConfiguration = {
      basePath: 'http://localhost',
    };
    const httpClient = new HttpClient();
    const gameService = new GameService(httpClient, apiConfiguration);
    const roomRepository = new RoomRepository(username, password, host, port, name, authDB);
    const roomService = new RoomService(roomRepository, gameService);

    socket = new MockedServerSocket();
    const logger = new Log();
    logger.UpdateLogLevel('fatal');
    roomController = new RoomController(roomService, logger, socket.socketClient);
  });

  afterAll(async () => {
    await roomController.Close();
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
