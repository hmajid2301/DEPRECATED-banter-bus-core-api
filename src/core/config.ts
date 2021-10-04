import convict from 'convict';
import { url } from 'convict-format-with-validator';
import yaml from 'js-yaml';

convict.addFormat(url);

convict.addParser({ extension: ['yml', 'yaml'], parse: yaml.load });

const config = convict({
  app: {
    environment: {
      doc: 'The application environment.',
      format: ['production', 'development'],
      default: 'development',
      env: 'NODE_ENV',
    },
    logLevel: {
      doc: 'The application environment.',
      format: ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'],
      default: 'INFO',
      env: 'LOG_LEVEL',
    },
  },
  database: {
    host: {
      doc: 'Database host name/IP',
      format: 'string',
      env: 'DATABASE_HOST',
    },
    port: {
      doc: 'The port to connect to for the database.',
      format: 'port',
      env: 'DATABASE_PORT',
    },
    username: {
      doc: 'Database username',
      format: String,
      env: 'DATABASE_USERNAME',
    },
    passowrd: {
      doc: 'Database password',
      format: String,
      env: 'DATABASE_PASSWORD',
    },
    name: {
      doc: 'Database name',
      format: String,
      env: 'DATABASE_NAME',
    },
    authDB: {
      doc: 'The Database to auth with.',
      format: String,
      env: 'DATABASE_AUTHDB',
    },
  },
  webserver: {
    cors: {
      doc: 'The clients that can access this server.',
      env: 'API_CORS',
      format: Array,
      default: ['*'],
    },
    port: {
      doc: 'The port to bind.',
      format: 'port',
      arg: 'port',
      env: 'API_PORT',
      default: 8080,
    },
  },
  managementAPI: {
    port: {
      doc: 'The port to connect to.',
      format: 'port',
      nullable: true,
      env: 'MANAGEMENT_API_PORT',
    },
    url: {
      doc: 'The URL to connect to.',
      format: 'url',
      env: 'MANAGEMENT_API_URL',
    },
  },
});

export { config };
