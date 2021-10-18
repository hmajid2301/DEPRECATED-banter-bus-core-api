import { createServer } from 'http';
import 'reflect-metadata';
import { Server, Socket } from 'socket.io';
import { TSConvict } from 'ts-convict';

import { Config } from '~/core/config/config';
import { SetupLogger, UpdateLogLevel } from '~/core/logger';
import { RoomController } from '~/rooms/room_controllers';

function main() {
  let logger = SetupLogger();
  const configLoader = new TSConvict<Config>(Config);
  const configFilePath = process.env.CONFIG_FILE_PATH ?? 'config.yml';
  const config: Config = configLoader.load(configFilePath);
  logger = UpdateLogLevel(logger, config.app.logLevel);

  const httpServer = createServer();
  const io = new Server(httpServer, {});

  const { username, password, host, port, name, authDB } = config.database;
  let managementAPIBase: string = config.managementAPI.url;
  if (config.managementAPI.port) {
    managementAPIBase += `:${config.managementAPI.port}`;
  }

  io.on('connection', (socket: Socket) => {
    const roomController = new RoomController(
      username,
      password,
      host,
      port,
      name,
      authDB,
      managementAPIBase,
      logger,
      socket,
    );
    socket.on('CREATE_ROOM', roomController.CreateRoom);
  });

  logger.info(`Banter Bus Core API started on 0.0.0.0:${config.webserver.port}`);
  httpServer.listen(config.webserver.port, '0.0.0.0');
}

main();
