import { Observable, of } from 'rxjs';

import roomFactory from '../../../tests/factories/room';
import { GameState } from '../room_models';
import { RoomRepository } from '../room_repository';
import { RoomService } from '../room_service';
import HttpClient from '~/clients/management_api/HttpClient';
import HttpResponse from '~/clients/management_api/HttpResponse';
import { IAPIConfiguration } from '~/clients/management_api/IAPIConfiguration';
import { GameService } from '~/clients/management_api/api/game.service';

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

    const apiConfiguration: IAPIConfiguration = {
      basePath: 'http://localhost',
    };
    const httpClient = new HttpClient();
    const gameService = new GameService(httpClient, apiConfiguration);

    const roomRepository = new RoomRepository(username, password, host, port, name, authDB);
    roomService = new RoomService(roomRepository, gameService);
  });

  afterAll(async () => {
    await roomService.Close();
  });

  test('Create a room ', async () => {
    const validGamesResponse: Observable<HttpResponse<string[]>> = of(new HttpResponse(['fibbing_it'], 200));
    jest.spyOn(GameService.prototype, 'getGames').mockReturnValue(validGamesResponse);

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
    const validGamesResponse: Observable<HttpResponse<string[]>> = of(new HttpResponse(['fibbing_it'], 200));
    jest.spyOn(GameService.prototype, 'getGames').mockReturnValue(validGamesResponse);

    const usedRoomCodes = ['FFFFF'];
    jest.spyOn(RoomRepository.prototype, 'GetAllRoomCodes').mockImplementation(() => Promise.resolve(usedRoomCodes));

    await expect(roomService.Create('quibly')).rejects.toThrowError();
  });
});
