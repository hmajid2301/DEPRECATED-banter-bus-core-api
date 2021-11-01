import { inject } from 'inversify';
import { Socket } from 'socket.io';

import { CreateRoom, RoomCreated } from './room_api_models';
import { IRoomService } from './room_service';
import { TYPES } from '~/container.types';
import { ILog } from '~/core/logger';
import { ErrorMessage } from '~/types';

export class RoomController {
  private socket: Socket;

  constructor(
    @inject(TYPES.RoomRepository) private readonly _roomService: IRoomService,
    @inject(TYPES.Logger) private readonly _log: ILog,
    socket: Socket,
  ) {
    this._log = _log;
    this.socket = socket;
  }

  public async CreateRoom(createRoom: CreateRoom): Promise<void> {
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
      this.socket.emit('ROOM_CREATED', roomCreated);
      logger.debug('Sent `ROOM_CREATED` message');
    } catch (err) {
      logger.error(`Failed to create a new room ${err}`);
      logger.debug('Sending `ERROR` message');
      const error: ErrorMessage = {
        code: 'room_created_failure',
        message: 'Failed to create room',
      };
      this.socket.emit('ERROR', error);
      logger.debug('Sent `ERROR` message');
    }
  }
}
