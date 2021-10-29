import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';

import roomFactory from '../../../tests/factories/room';
import { GameState } from '../room_models';
import { RoomRepository } from '../room_repository';
import { RoomService } from '../room_service';
import { GameApi } from '~/clients/management_api';

describe('Room Service', () => {
  test('Create a room ', async () => {
    const roomService = new RoomService(
      'mongodb-memory-server-root',
      'rootuser',
      'localhost',
      5133,
      'banterbus',
      'admin',
      'http://localhost',
    );

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
});
