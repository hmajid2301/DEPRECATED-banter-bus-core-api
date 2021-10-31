import { Socket } from 'socket.io';

import { CreateRoom } from './rooms/room_api_models';
import { RoomController } from './rooms/room_controllers';

export function RegisterRoomHandler(socket: Socket, roomController: RoomController) {
  socket.on('CREATE_ROOM', (data: CreateRoom) => {
    roomController.CreateRoom(data);
  });
}
