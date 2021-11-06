import { inject } from 'inversify';

import { CreateRoom, RoomCreated } from './room_api_models';
import { IRoomService } from './room_service';
import { TYPES } from '~/container.types';
import { ILog } from '~/core/logger';
import { ErrorMessage, ResponseEvent } from '~/types';

export class RoomController {
  constructor(
    @inject(TYPES.RoomRepository) private readonly _roomService: IRoomService,
    @inject(TYPES.Logger) private readonly _log: ILog,
  ) {
    this._log = _log;
  }

  public async CreateRoom(createRoom: CreateRoom): Promise<ResponseEvent> {
    const logger = this._log.GetLogger();
    logger.debug('Trying to create a new room');
    try {
      const newRoom = await this._roomService.Create(createRoom.gameName);
      logger.debug('Created room in DB');
      const roomCreated: RoomCreated = {
        roomCode: newRoom.roomCode,
        roomID: newRoom.id,
      };
      logger.debug('Sending `ROOM_CREATED` message');
      return {
        eventName: 'ROOM_CREATED',
        eventContent: roomCreated,
      };
    } catch (err) {
      logger.error(`Failed to create a new room`);
      logger.error(err);
      logger.debug('Sending `ERROR` message');
      const error: ErrorMessage = {
        code: 'room_created_failure',
        message: 'Failed to create room',
      };
      return {
        eventName: 'ERROR',
        eventContent: error,
      };
    }
  }

  public async Close(): Promise<void> {
    await this._roomService.Close();
  }
}
