import 'dotenv/config';

export const SERVER_CONFIG = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || "surrealkv://data.db",
    namespace: process.env.DB_NAMESPACE || "local",
    database: process.env.DB_DATABASE || "persisted",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  }
};

console.log("SERVER_CONFIG:", SERVER_CONFIG);
