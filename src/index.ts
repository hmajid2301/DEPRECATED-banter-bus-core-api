import { createServer, Server as HTTPServer } from 'http';
import 'module-alias/register';
import 'reflect-metadata';
import { Server, Socket } from 'socket.io';
import { TSConvict } from 'ts-convict';

import { setupContainers } from './container';
import { TYPES } from './container.types';
import { RegisterRoomHandler as RegisterRoomHandlers } from './handlers';
import { RoomController } from './rooms/room_controllers';
import { Config, IConfig } from '~/core/config';
import { Log } from '~/core/logger';

export function setupServer(httpServer: HTTPServer) {
  const log = new Log();
  const configLoader = new TSConvict<IConfig>(Config);
  const configFilePath = process.env.CONFIG_FILE_PATH ?? 'config.yml';
  const config: IConfig = configLoader.load(configFilePath);
  log.UpdateLogLevel(config.app.logLevel);
  log.UpdateFormat(config.app.environment);
  const logger = log.GetLogger();

  const container = setupContainers(config);

  const io = new Server(httpServer, {
    cors: {
      origin: config.webserver.cors,
    },
  });

  const roomController: RoomController = container.get(TYPES.RoomController);
  io.on('connection', (socket: Socket) => {
    logger.debug('New client connected');

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
