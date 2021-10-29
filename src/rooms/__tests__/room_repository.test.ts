import roomFactory from '../../../tests/factories/room';
import { GameState, Room } from '../room_models';
import { RoomRepository } from '../room_repository';

describe('Room Repository', () => {
  let roomRepository: RoomRepository;

  beforeAll(() => {
    roomRepository = new RoomRepository(
      'mongodb-memory-server-root',
      'rootuser',
      'localhost',
      5133,
      'banterbus',
      'admin',
    );
  });

  afterAll(async () => {
    await roomRepository.CloseConnection();
  });

  afterEach(async () => {
    await roomRepository.Clear();
  });

  test('Create a room ', async () => {
    const roomToCreate = roomFactory.build();
    const room = await roomRepository.Create(roomToCreate);

    expect(room.id).toBe(roomToCreate.id);
    expect(room.gameName).toBe(roomToCreate.gameName);
    expect(room.roomCode).toBe(roomToCreate.roomCode);
    expect(room.state).toBe(GameState.CREATED);
    if (room.players) {
      expect(room.players.length).toBe(0);
    }
  });

  test('Get a room ', async () => {
    const roomToCreate = roomFactory.build();
    const createdRoom = await roomRepository.Create(roomToCreate);

    const room = (await roomRepository.Get(createdRoom.id)) as Room;
    expect(room.id).toBe(roomToCreate.id);
    expect(room.gameName).toBe(roomToCreate.gameName);
    expect(room.roomCode).toBe(roomToCreate.roomCode);
    expect(room.state).toBe(GameState.CREATED);
    if (room.players) {
      expect(room.players.length).toBe(0);
    }
  });

  test('Update a room ', async () => {
    const roomToCreate = roomFactory.build();
    const createdRoom = await roomRepository.Create(roomToCreate);

    const createdAt = new Date();
    const room = (await roomRepository.Update(createdRoom.id, {
      id: 'abc',
      gameName: 'quibly',
      roomCode: 'ABCDF',
      state: GameState.JOINING,
      players: ['haseeb', 'majid'],
      createdAt,
      updatedAt: createdAt,
    })) as Room;

    expect(room.id).toBe('abc');
    expect(room.gameName).toBe('quibly');
    expect(room.roomCode).toBe('ABCDF');
    expect(room.state).toBe(GameState.JOINING);
    if (room.players) {
      expect(room.players.length).toBe(2);
    }
  });

  test('Delete a room ', async () => {
    const roomToCreate = roomFactory.build();
    const createdRoom = await roomRepository.Create(roomToCreate);

    await roomRepository.Delete(createdRoom.id);
    const room = await roomRepository.Get(createdRoom.id);
    expect(room).toBe(undefined);
  });

  test('Get all room codes', async () => {
    const rooms = roomFactory.buildList(3);
    const expectedCodes: string[] = [];
    rooms.forEach(async (room) => {
      await roomRepository.Create(room);
      expectedCodes.push(room.roomCode);
    });

    const roomCodes = await roomRepository.GetAllRoomCodes();
    expect(roomCodes.sort()).toEqual(expectedCodes.sort());
  });
});
