import { createServer } from 'http';

import { Server, Socket } from 'socket.io';

import { config } from '~/core/config';
import { SetupLogger, UpdateLogLevel } from '~/core/logger';

function main() {
  let logger = SetupLogger();
  const configFilePath = process.env.CONFIG_FILE_PATH ?? 'config.yml';
  config.loadFile(configFilePath);
  config.validate({ allowed: 'strict' });
  logger = UpdateLogLevel(logger, config.get('app.logLevel'));
  console.log('Logger', logger);

  const httpServer = createServer();
  const io = new Server(httpServer, {});
  io.on('connection', (socket: Socket) => {
    console.log('TEST', socket);
  });

  httpServer.listen(3000);
}

main();
