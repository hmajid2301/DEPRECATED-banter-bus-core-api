import { createServer, Server as HTTPServer } from 'http';
import 'reflect-metadata';
import Client, { Socket } from 'socket.io-client';

import { setupServer } from '~/index';
import { CreateRoom, RoomCreated } from '~/rooms/room_api_models';
import { ErrorMessage } from '~/types';

describe('Room Integration Tests', () => {
  let httpServer: HTTPServer;
  let clientSocket: Socket;

  beforeAll((done) => {
    httpServer = createServer();
    setupServer();
    httpServer.close();

    clientSocket = Client(`http://localhost:8080`);
    clientSocket.on('connect', done);
  });

  afterAll(() => {
    clientSocket.close();
  });

  test('Create a new room', (done) => {
    const createdRoom: CreateRoom = {
      gameName: 'fibbing_it',
    };

    clientSocket.emit('CREATE_ROOM', createdRoom);
    clientSocket.on('ROOM_CREATED', (roomCreated: RoomCreated) => {
      const { roomCode, roomID } = roomCreated;

      expect(roomCode).toMatch(/^[A-Z]{0,5}$/);
      expect(roomID).toBeTruthy();
      done();
    });
  });

  test('Fail to create a new room', () => {
    const createdRoom: CreateRoom = {
      gameName: 'quibly',
    };

    clientSocket.emit('CREATE_ROOM', createdRoom);
    clientSocket.on('ERROR', (error: ErrorMessage) => {
      const { code, message } = error;
      expect(code).toBe('room_created_failure');
      expect(message).toBe('Failed to create room');
    });
  });
});
