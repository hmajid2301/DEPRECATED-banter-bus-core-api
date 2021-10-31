import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import roomFactory from '../../../tests/factories/room';
import { GameState } from '../room_models';
import { RoomRepository } from '../room_repository';
import { RoomService } from '../room_service';
import { GameApi } from '~/clients/management_api';

describe('Room Service', () => {
  let roomService: RoomService;
  beforeAll(() => {
    const { username, password, host, port, name, authDB } = {
      username: 'mongodb-memory-server-root',
      password: 'rootuser',
      host: 'localhost',
      port: 5133,
      name: 'banterbus',
      authDB: 'admin',
    };

    const roomRepository = new RoomRepository(username, password, host, port, name, authDB);
    roomService = new RoomService(roomRepository, 'http://localhost');
  });

  test('Create a room ', async () => {
    const validGamesResponse: AxiosResponse<string[], unknown> = {
      data: ['fibbing_it'],
      status: StatusCodes.OK,
      statusText: 'all good',
      headers: {},
      config: {},
    };
    jest.spyOn(GameApi.prototype, 'getGamesFm').mockImplementation(() => Promise.resolve(validGamesResponse));

    const usedRoomCodes = ['FFFFF'];
    jest.spyOn(RoomRepository.prototype, 'GetAllRoomCodes').mockImplementation(() => Promise.resolve(usedRoomCodes));

    const room = roomFactory.build({ gameName: 'fibbing_it' });
    jest.spyOn(RoomRepository.prototype, 'Create').mockImplementation(() => Promise.resolve(room));

    const createdRoom = await roomService.Create(room.gameName);
    expect(createdRoom.gameName).toBe(room.gameName);
    expect(createdRoom.roomCode).not.toBe('FFFFF');
    expect(createdRoom.state).toBe(GameState.CREATED);
  });

  test('Attempt to a create a room with invalid game', async () => {
    const validGamesResponse: AxiosResponse<string[], unknown> = {
      data: ['fibbing_it'],
      status: StatusCodes.OK,
      statusText: 'all good',
      headers: {},
      config: {},
    };
    jest.spyOn(GameApi.prototype, 'getGamesFm').mockImplementation(() => Promise.resolve(validGamesResponse));

    const usedRoomCodes = ['FFFFF'];
    jest.spyOn(RoomRepository.prototype, 'GetAllRoomCodes').mockImplementation(() => Promise.resolve(usedRoomCodes));

    await expect(roomService.Create('quibly')).rejects.toThrowError();
  });
});
