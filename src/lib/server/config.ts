import {
  PORT,
} from "$env/static/private";

export const SERVER_CONFIG = {
  port: PORT || 3000,
  db: {
    host: process.env.DB_USERNAME || "surrealkv://data.db",
    namespace: process.env.DB_USERNAME || "local",
    database: process.env.DB_USERNAME || "persisted",
    username: process.env.DB_USERNAME,
    password: process.env.DB_USERNAME,
  }
};

console.log("SERVER_CONFIG:", SERVER_CONFIG);
