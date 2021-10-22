import { GameState, Room } from './room_models';
import { BaseRepository } from '~/core/repository/repository';

export class RoomRepository extends BaseRepository<Room> {
  constructor(username: string, password: string, host: string, port: number, dbName: string, authDB: string) {
    super(Room, username, password, host, port, dbName, authDB);
  }

  public async GetAllRoomCodes(): Promise<string[]> {
    interface RoomCode {
      roomCodes: string[];
    }

    const pipeline = [
      {
        $match: { state: { $nin: [GameState.FINISHED, GameState.ABANDONED] } },
      },
      {
        $group: {
          _id: '_id',
          roomCodes: { $addToSet: '$roomCode' },
        },
      },
      { $unset: '_id' },
    ];

    return new Promise((resolve, reject) => {
      this.model
        .aggregate(pipeline)
        .then((result: RoomCode[]) => {
          if (result.length) {
            resolve(result[0].roomCodes);
          }
          resolve([]);
        })
        .catch((err) => reject(err));
    });
  }
}
