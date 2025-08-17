import {
  DB_HOST,
  DB_NAMESPACE,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  PORT,
} from "$env/static/private";

export const SERVER_CONFIG = {
  port: PORT || 3000,
  db: {
    host: DB_HOST || "surrealkv://data.db",
    namespace: DB_NAMESPACE || "local",
    database: DB_DATABASE || "persisted",
    username: DB_USERNAME || "root",
    password: DB_PASSWORD || "root",
  }
};

console.log("SERVER_CONFIG:", SERVER_CONFIG);
