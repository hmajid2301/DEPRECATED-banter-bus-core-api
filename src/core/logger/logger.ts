import bunyan, { LogLevel } from 'bunyan';

function SetupLogger(): bunyan {
  const logger = bunyan.createLogger({ name: 'banter-bus-core-api', src: true });
  return logger;
}

function UpdateLogLevel(logger: bunyan, logLevel: string): bunyan {
  logger.level(logLevel as LogLevel);
  return logger;
}

export { SetupLogger, UpdateLogLevel };
