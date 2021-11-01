import { Logger, TLogLevelName } from 'tslog';

export interface ILog {
  UpdateLogLevel(logLevel: string): void;
  UpdateFormat(environment: string): void;
  GetLogger(): Logger;
}

export class Log implements ILog {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger({
      name: 'banter-bus-core-api',
      type: 'json',
      colorizePrettyLogs: true,
    });
  }

  public UpdateLogLevel(logLevel: string) {
    this.logger.setSettings({ minLevel: logLevel as TLogLevelName });
  }

  public UpdateFormat(environment: string) {
    const logType = environment === 'production' ? 'json' : 'pretty';
    this.logger.setSettings({ type: logType });
  }

  public GetLogger(): Logger {
    return this.logger;
  }
}
