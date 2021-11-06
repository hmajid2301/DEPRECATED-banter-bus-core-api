import { Socket } from 'socket.io';

import { CreateRoom } from './rooms/room_api_models';
import { RoomController } from './rooms/room_controllers';

export function RegisterRoomHandler(socket: Socket, roomController: RoomController) {
  socket.on('CREATE_ROOM', async (data: CreateRoom) => {
    const response = await roomController.CreateRoom(data);
    socket.emit(response.eventName, response.eventContent);
  });
}
