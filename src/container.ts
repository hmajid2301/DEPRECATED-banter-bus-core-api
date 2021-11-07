import { Container } from 'inversify';

import { ApiServiceBinder } from './clients/management_api/ApiServiceBinder';
import HttpClient from './clients/management_api/HttpClient';
import { IAPIConfiguration } from './clients/management_api/IAPIConfiguration';
import IHttpClient from './clients/management_api/IHttpClient';
import { TYPES } from './container.types';
import { IConfig } from './core/config';
import { ILog, Log } from './core/logger';
import { IRoomController, RoomController } from './rooms/room_controllers';
import { IRoomRepository, RoomRepository } from './rooms/room_repository';
import { IRoomService, RoomService } from './rooms/room_service';

export function setupContainers(config: IConfig): Container {
  const { username, password, host, port, name, authDB } = config.database;
  let managementAPIBase: string = config.managementAPI.url;
  if (config.managementAPI.port) {
    managementAPIBase += `:${config.managementAPI.port}`;
  }

  const container = new Container();
  const apiConfiguration: IAPIConfiguration = {
    basePath: managementAPIBase,
  };
  container.bind<IAPIConfiguration>(TYPES.ApiConfiguration).toConstantValue(apiConfiguration);
  container.bind<IHttpClient>(TYPES.HttpClient).to(HttpClient);
  const roomRepository = new RoomRepository(username, password, host, port, name, authDB);
  container.bind<IRoomRepository>(TYPES.RoomRepository).toConstantValue(roomRepository);
  container.bind<IRoomService>(TYPES.RoomService).to(RoomService);
  container.bind<IRoomController>(TYPES.RoomController).to(RoomController);

  const log = new Log();
  log.UpdateLogLevel(config.app.logLevel);
  log.UpdateFormat(config.app.environment);
  container.bind<ILog>(TYPES.Logger).toConstantValue(log);

  ApiServiceBinder.with(container);
  return container;
}
