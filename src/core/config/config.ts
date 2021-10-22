import { url } from 'convict-format-with-validator';
import yaml from 'js-yaml';
import { Config as Conf, Property } from 'ts-convict';

class Database implements config.Database {
  @Property({
    doc: 'Database host name/IP',
    format: String,
    env: 'DATABASE_HOST',
    default: 'banterbus',
  })
  public host!: string;

  @Property({
    doc: 'The port to connect to for the database.',
    format: 'port',
    default: 5432,
    env: 'DATABASE_PORT',
  })
  public port!: number;

  @Property({
    doc: 'Database username',
    format: String,
    env: 'DATABASE_USERNAME',
    default: 'banterbus',
  })
  public username!: string;

  @Property({
    doc: 'Database password',
    format: String,
    env: 'DATABASE_PASSWORD',
    default: '',
  })
  public password!: string;

  @Property({
    doc: 'Database name',
    format: String,
    env: 'DATABASE_NAME',
    default: 'banterbus',
  })
  public name!: string;

  @Property({
    doc: 'The Database to auth with.',
    format: String,
    env: 'DATABASE_AUTHDB',
    nullable: true,
    default: null,
  })
  public authDB!: string;
}

class App implements config.AppConfig {
  @Property({
    doc: 'The application environment.',
    format: ['debug', 'info', 'warning', 'error', 'critical'],
    default: 'info',
    env: 'LOG_LEVEL',
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

class Webserver implements config.WebServerConfig {
  @Property({
    doc: 'The clients that can access this server.',
    env: 'API_CORS',
    format: Array,
    default: ['*'],
  })
  public cors!: string[];

  @Property({
    doc: 'The port to bind.',
    format: 'port',
    arg: 'port',
    env: 'API_PORT',
    default: 8080,
  })
  public port!: number;
}

class ManagementAPI implements config.ManagementAPIConfig {
  @Property({
    doc: 'The port to connect to.',
    format: 'port',
    nullable: true,
    env: 'MANAGEMENT_API_PORT',
    default: null,
  })
  public port!: number | null;

  @Property({
    doc: 'The URL to connect to.',
    format: 'url',
    env: 'MANAGEMENT_API_URL',
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
export class Config implements config.Config {
  @Property(App)
  public app!: config.AppConfig;

  @Property(Database)
  public database!: config.Database;

  @Property(Webserver)
  public webserver!: config.WebServerConfig;

  @Property(ManagementAPI)
  public managementAPI!: config.ManagementAPIConfig;
}
