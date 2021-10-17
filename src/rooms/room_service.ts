import { v4 as uuidv4 } from 'uuid';

import { GameState, Room } from './room_models';
import { RoomRepository } from './room_repository';
import { GameApi } from '~/clients/management_api/';

export class RoomService {
  private roomRepo: RoomRepository;

  private gameAPI: GameApi;

  constructor(
    username: string,
    password: string,
    host: string,
    port: number,
    dbName: string,
    authDB: string,
    managementAPIBase: string,
  ) {
    const roomRepo = new RoomRepository(username, password, host, port, dbName, authDB);
    this.roomRepo = roomRepo;
    this.gameAPI = new GameApi(undefined, managementAPIBase);
  }

  public async Create(gameName: string): Promise<Room> {
    const validGame = await this.isValidGame(gameName);
    if (!validGame) {
      throw new Error(`game ${gameName} is not valid`);
    }

    const roomCode = await this.getRoomCode();
    const roomID = uuidv4();
    const createdAt = new Date();

    const room = await this.roomRepo.Create({
      id: roomID,
      gameName,
      roomCode,
      players: [],
      state: GameState.CREATED,
      createdAt,
      updatedAt: createdAt,
    });
    return room;
  }

  private async getRoomCode(): Promise<string> {
    const unavailableRoomCodes = await this.roomRepo.GetAllRoomCodes();
    let codeUsed = false;
    let roomCode: string;

    do {
      roomCode = RoomService.generateRandomRoomCode();
      codeUsed = unavailableRoomCodes.includes(roomCode);
    } while (codeUsed);

    return roomCode;
  }

  private static generateRandomRoomCode(): string {
    let roomCode = '';
    const roomCodeLen = 5;
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < roomCodeLen; i += 1) {
      const randomChar = validChars.charAt(Math.floor(Math.random() * validChars.length));
      roomCode += randomChar;
    }

    return roomCode;
  }

  private async isValidGame(gameName: string): Promise<boolean> {
    const response = await this.gameAPI.getGamesFm();
    const gameNames = response.data;

    const gameExists = gameNames.includes(gameName);
    return gameExists;
  }
}
