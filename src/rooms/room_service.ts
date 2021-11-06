import { inject, injectable } from 'inversify';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { GameState, Room } from './room_models';
import { IRoomRepository } from './room_repository';
import { GameService } from '~/clients/management_api/api/game.service';
import { TYPES } from '~/container.types';

export interface IRoomService {
  Create(gameName: string): Promise<Room>;
  Close(): Promise<void>;
}

@injectable()
export class RoomService implements IRoomService {
  constructor(
    @inject(TYPES.RoomRepository) private readonly _roomRepository: IRoomRepository,
    @inject(TYPES.IApiConfiguration) private readonly _gameAPI: GameService,
  ) {}

  public async Create(gameName: string): Promise<Room> {
    try {
      const validGame = await this.isValidGame(gameName);
      if (!validGame) {
        throw new Error(`game ${gameName} is not valid`);
      }
    } catch (err) {
      throw new Error(`failed to fetch valid games ${err}`);
    }

    const roomCode = await this.getRoomCode();
    const roomID = uuidv4();
    const createdAt = new Date();

    const room = await this._roomRepository.Create({
      id: roomID,
      gameName,
      roomCode,
      state: GameState.CREATED,
      createdAt,
      updatedAt: createdAt,
    });
    return room;
  }

  private async getRoomCode(): Promise<string> {
    const unavailableRoomCodes = await this._roomRepository.GetAllRoomCodes();
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
    const response = this._gameAPI.getGames('enabled', 'response');
    const data = await firstValueFrom(response);
    const gameNames = data.response;

    const gameExists = gameNames.includes(gameName);
    return gameExists;
  }

  public async Close(): Promise<void> {
    await this._roomRepository.CloseConnection();
  }
}
