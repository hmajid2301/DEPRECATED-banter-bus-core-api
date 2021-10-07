import { RoomRepository } from './room_repository';

export class RoomService {
  constructor(username: string, password: string, host: string, port: number, dbName: string, authDB: string) {
    const roomRepo = new RoomRepository(username, password, host, port, dbName, authDB);
    console.log(roomRepo);
  }
}
