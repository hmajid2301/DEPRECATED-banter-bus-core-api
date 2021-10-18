import { AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { GameState, Room } from '../room_models';
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

    const createdAt = new Date();
    const room: Room = {
      id: uuidv4(),
      gameName: 'fibbing_it',
      roomCode: 'ABCDE',
      state: GameState.CREATED,
      createdAt,
      updatedAt: createdAt,
    };
    jest.spyOn(RoomRepository.prototype, 'Create').mockImplementation(() => Promise.resolve(room));

    const createdRoom = await roomService.Create('fibbing_it');
    expect(createdRoom.gameName).toBe('fibbing_it');
    expect(createdRoom.roomCode).not.toBe('FFFFF');
    expect(createdRoom.state).toBe(GameState.CREATED);
  });
});
