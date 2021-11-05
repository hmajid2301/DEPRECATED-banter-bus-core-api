import { createServer, Server as HTTPServer } from 'http';
import { Container } from 'inversify';
import 'module-alias/register';
import 'reflect-metadata';
import { Server, Socket } from 'socket.io';
import { TSConvict } from 'ts-convict';

import { TYPES } from './container.types';
import { RegisterRoomHandler as RegisterRoomHandlers } from './handlers';
import { IRoomRepository, RoomRepository } from './rooms/room_repository';
import { IRoomService, RoomService } from './rooms/room_service';
import { Config } from '~/core/config';
import { Log } from '~/core/logger';
import { RoomController } from '~/rooms/room_controllers';

export function setupServer(httpServer: HTTPServer) {
  const log = new Log();
  const configLoader = new TSConvict<Config>(Config);
  const configFilePath = process.env.CONFIG_FILE_PATH ?? 'config.yml';
  const config: Config = configLoader.load(configFilePath);
  log.UpdateLogLevel(config.app.logLevel);
  log.UpdateFormat(config.app.environment);
  const logger = log.GetLogger();

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

  const io = new Server(httpServer, {
    cors: {
      origin: config.webserver.cors,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.debug('New client connected');
    const roomController = new RoomController(roomService, log, socket);

    RegisterRoomHandlers(socket, roomController);
  });

  io.close();

  logger.info(`Banter Bus Core API started on 0.0.0.0:${config.webserver.port}`);
  httpServer.listen(config.webserver.port, '0.0.0.0');
}

function main() {
  const httpServer = createServer();
  setupServer(httpServer);
}

if (require.main === module) {
  main();
}
