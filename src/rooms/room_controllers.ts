import pino from 'pino';
import { Socket } from 'socket.io';

import { CreateRoom, RoomCreated } from './room_api_models';
import { RoomService } from './room_service';
import { Config } from '~/core/config/config';
import { ErrorMessage } from '~/types';

export class RoomController {
  private roomService: RoomService;

  private logger: pino.Logger;

  private socket: Socket;

  constructor(config: Config, logger: pino.Logger, socket: Socket) {
    const { username, password, host, port, name, authDB } = config.database;
    let managementAPIBase: string = config.managementAPI.url;
    if (config.managementAPI.port) {
      managementAPIBase += `:${config.managementAPI.port}`;
    }

    const roomService = new RoomService(username, password, host, port, name, authDB, managementAPIBase);
    this.roomService = roomService;
    this.logger = logger;
    this.socket = socket;
  }

  public async CreateRoom(createRoom: CreateRoom): Promise<void> {
    this.logger.debug('Creating room');
    try {
      const newRoom = await this.roomService.Create(createRoom.gameName);
      this.logger.debug('Created room in DB.');
      const roomCreated: RoomCreated = {
        roomCode: newRoom.roomCode,
        roomID: newRoom.id,
      };
      this.socket.emit('ROOM_CREATED', roomCreated);
      this.logger.debug('Sending `ROOM_CREATED` message.');
    } catch (err) {
      this.logger.error(`Failed to create a new room ${err}`);
      const error: ErrorMessage = {
        code: 'room_created_failure',
        message: 'Failed to create room.',
      };
      this.socket.emit('ERROR', error);
    }
  }
}
