import { createServer } from 'http';
import { Container } from 'inversify';
import 'module-alias/register';
import 'reflect-metadata';
import { Server, Socket } from 'socket.io';
import { TSConvict } from 'ts-convict';

import { TYPES } from './container.types';
import { RegisterRoomHandler as RegisterRoomHandlers } from './handlers';
import { IRoomRepository, RoomRepository } from './rooms/room_repository';
import { IRoomService, RoomService } from './rooms/room_service';
import { Config } from '~/core/config/config';
import { SetupLogger, UpdateLogLevel } from '~/core/logger/logger';
import { RoomController } from '~/rooms/room_controllers';

export function setupServer() {
  let logger = SetupLogger();
  const configLoader = new TSConvict<Config>(Config);
  const configFilePath = process.env.CONFIG_FILE_PATH ?? 'config.yml';
  const config: Config = configLoader.load(configFilePath);
  logger = UpdateLogLevel(logger, config.app.logLevel);

  const { username, password, host, port, name, authDB } = config.database;
  let managementAPIBase: string = config.managementAPI.url;
  if (config.managementAPI.port) {
    managementAPIBase += `:${config.managementAPI.port}`;
  }

  const container = new Container();
  const roomRepository = new RoomRepository(username, password, host, port, name, authDB);
  container.bind<IRoomRepository>(TYPES.RoomRepository).toConstantValue(roomRepository);

  const roomService = new RoomService(roomRepository, managementAPIBase);
  container.bind<IRoomService>(TYPES.RoomService).toConstantValue(roomService);

  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: config.webserver.cors,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.debug('New client connected');
    const roomController = new RoomController(roomService, logger, socket);


    RegisterRoomHandlers(socket, roomController);
  });

  logger.info(`Banter Bus Core API started on 0.0.0.0:${config.webserver.port}`);
  httpServer.listen(config.webserver.port, '0.0.0.0');
}

function main() {
  setupServer();
}

if (require.main === module) {
  main();
}
