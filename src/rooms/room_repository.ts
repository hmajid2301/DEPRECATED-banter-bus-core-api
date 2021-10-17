import { GameState, Room } from './room_models';
import { BaseRepository } from '~/core/repository/repository';

export class RoomRepository extends BaseRepository<Room> {
  constructor(username: string, password: string, host: string, port: number, dbName: string, authDB: string) {
    super(Room, username, password, host, port, dbName, authDB);
  }

  public async GetAllRoomCodes(): Promise<string[]> {
    const pipeline = [
      {
        $match: { state: { $nin: [GameState.FINISHED, GameState.ABANDONED] } },
      },
      {
        $project: { $item: 1, field: { $ifNull: ['room_code', ''] } },
      },
      {
        $group: {
          _id: '_id',
          temp: { addToSet: 'room_code' },
        },
      },
      { unset: ['_id'] },
    ];

    return new Promise((resolve, reject) => {
      this.model
        .aggregate(pipeline)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }
}
