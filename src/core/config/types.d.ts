declare namespace config {
  export interface AppConfig {
    environment: string;
    logLevel: string;
  }

  export interface Database {
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
    database: Database;
    webserver: WebServerConfig;
    managementAPI: ManagementAPIConfig;
  }
}
