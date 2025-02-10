export enum Environment {
  Development = 'dev',
  Production = 'prod',
  Staging = 'staging',
}

export abstract class AppConfig {
  dbUrl: string;
  port: number;
  env: Environment;
  jwtSecret: string;
}

export default (): AppConfig => ({
  dbUrl: process.env.DATABASE_URL,
  port: parseInt(process.env.PORT, 10),
  env: process.env.ENV as Environment,
  jwtSecret: process.env.JWT_SECRET,
});
