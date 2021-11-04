import { url } from 'convict-format-with-validator';
import yaml from 'js-yaml';
import { Config as Conf, Property } from 'ts-convict';

export interface AppConfig {
  environment: string;
  logLevel: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  authDB: string;
}

export interface WebServerConfig {
  cors: string[];
  port: number;
}

export interface ManagementAPIConfig {
  port: number | null;
  url: string;
}

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  webserver: WebServerConfig;
  managementAPI: ManagementAPIConfig;
}

class Database implements DatabaseConfig {
  @Property({
    doc: 'Database host name/IP',
    format: String,
    env: 'BANTER_BUS_CORE_API_DATABASE_HOST',
    default: 'banterbus',
  })
  public host!: string;

  @Property({
    doc: 'The port to connect to for the database.',
    format: 'port',
    default: 5432,
    env: 'BANTER_BUS_CORE_API_DATABASE_PORT',
  })
  public port!: number;

  @Property({
    doc: 'Database username',
    format: String,
    env: 'BANTER_BUS_CORE_API_DATABASE_USERNAME',
    default: 'banterbus',
  })
  public username!: string;

  @Property({
    doc: 'Database password',
    format: String,
    env: 'BANTER_BUS_CORE_API_DATABASE_PASSWORD',
    default: '',
  })
  public password!: string;

  @Property({
    doc: 'Database name',
    format: String,
    env: 'BANTER_BUS_CORE_API_DATABASE_NAME',
    default: 'banterbus',
  })
  public name!: string;

  @Property({
    doc: 'The Database to auth with.',
    format: String,
    env: 'BANTER_BUS_CORE_API_DATABASE_AUTHDB',
    nullable: true,
    default: null,
  })
  public authDB!: string;
}

class App implements AppConfig {
  @Property({
    doc: 'The application environment.',
    format: ['debug', 'info', 'warning', 'error', 'critical'],
    default: 'info',
    env: 'BANTER_BUS_CORE_API_LOG_LEVEL',
  })
  public logLevel!: string;

  @Property({
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  })
  public environment!: string;
}

class Webserver implements WebServerConfig {
  @Property({
    doc: 'The clients that can access this server.',
    env: 'BANTER_BUS_CORE_API_CORS',
    format: Array,
    default: ['*'],
  })
  public cors!: string[];

  @Property({
    doc: 'The port to bind.',
    format: 'port',
    arg: 'port',
    env: 'BANTER_BUS_CORE_API_PORT',
    default: 8080,
  })
  public port!: number;
}

class ManagementAPI implements ManagementAPIConfig {
  @Property({
    doc: 'The port to connect to.',
    format: 'port',
    nullable: true,
    env: 'BANTER_BUS_CORE_API_MANAGEMENT_API_PORT',
    default: null,
  })
  public port!: number | null;

  @Property({
    doc: 'The URL to connect to.',
    format: 'url',
    env: 'BANTER_BUS_CORE_API_MANAGEMENT_API_URL',
    default: 'http://localhost',
  })
  public url!: string;
}

@Conf({
  file: 'config.yml',
  validationMethod: 'strict',
  parser: {
    extension: ['yml', 'yaml'],
    parse: yaml.load,
  },
  formats: {
    url,
  },
})
export class Config implements Config {
  @Property(App)
  public app!: AppConfig;

  @Property(Database)
  public database!: Database;

  @Property(Webserver)
  public webserver!: WebServerConfig;

  @Property(ManagementAPI)
  public managementAPI!: ManagementAPIConfig;
}
