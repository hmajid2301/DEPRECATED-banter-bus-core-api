import bunyan from 'bunyan';
import { inject } from 'inversify';
import { Socket } from 'socket.io';

import { CreateRoom, RoomCreated } from './room_api_models';
import { IRoomService } from './room_service';
import { TYPES } from '~/container.types';
import { ErrorMessage } from '~/types';

export class RoomController {
  private logger: bunyan;

  private socket: Socket;

  constructor(
    @inject(TYPES.RoomRepository) private readonly _roomService: IRoomService,
    logger: bunyan,
    socket: Socket,
  ) {
    this.logger = logger;
    this.socket = socket;
  }

  public async CreateRoom(createRoom: CreateRoom): Promise<void> {
    this.logger.debug('Creating room');
    try {
      const newRoom = await this._roomService.Create(createRoom.gameName);
      this.logger.debug('Created room in DB');
      const roomCreated: RoomCreated = {
        roomCode: newRoom.roomCode,
        roomID: newRoom.id,
      };
      this.socket.emit('ROOM_CREATED', roomCreated);
      this.logger.debug('Sending `ROOM_CREATED` message');
    } catch (err) {
      this.logger.error('Failed to create a new room', { err });
      const error: ErrorMessage = {
        code: 'room_created_failure',
        message: 'Failed to create room',
      };
      this.socket.emit('ERROR', error);
    }
  }
}
