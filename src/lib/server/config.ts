import {
  DB_DATABASE,
  DB_HOST,
  DB_NAMESPACE,
  DB_PASSWORD,
  DB_USERNAME,
  PORT,
} from "$env/static/private";

export const SERVER_CONFIG = {
  port: PORT || 3000,
  db: {
    host: DB_HOST || "surrealkv://data.db",
    namespace: DB_NAMESPACE || "local",
    database: DB_DATABASE || "persisted",
    username: DB_USERNAME,
    password: DB_PASSWORD,
  }
};

console.log("SERVER_CONFIG:", SERVER_CONFIG);
