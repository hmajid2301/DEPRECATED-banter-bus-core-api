import { Room } from './room_models';
import { BaseRepository } from '~/core/repository/repository';

export class RoomRepository extends BaseRepository<Room> {
  constructor(username: string, password: string, host: string, port: number, dbName: string, authDB: string) {
    super(Room, username, password, host, port, dbName, authDB);
  }
}
