import pino from 'pino';

function SetupLogger(): pino.Logger {
  const logger = pino();
  return logger;
}

function UpdateLogLevel(logger: pino.Logger, logLevel: string): pino.Logger {
  const updatedLogger = logger;
  updatedLogger.level = logLevel;
  return updatedLogger;
}

export { SetupLogger, UpdateLogLevel };
