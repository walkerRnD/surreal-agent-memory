import { Surreal } from "surrealdb";
import { SERVER_CONFIG } from "../config.js";
import { surrealdbNodeEngines } from "@surrealdb/node";
import { INIT_DB_QUERY } from "./init-db.query.js";

function dLog(message: string, data?: any) {
  console.log(`[SurrealDB] ${message}`, data);
}
const SERVER_DB_CONF = SERVER_CONFIG.db;
let db: Surreal | undefined;
export async function getDb(): Promise<Surreal> {
  // dLog("getDb - Starting database connection process");

  if (db) {
    try {
      await db.info();
      // dLog("getDb - Existing connection is healthy");
      return db;
    } catch (error) {
      dLog("getDb - Existing connection failed, reconnecting", {
        error: error instanceof Error ? error.message : String(error),
      });
      db = await createDbConnection(SERVER_DB_CONF);
      dLog("getDb - Reconnection successful");
      return db;
    }
  }

  try {
    // dLog("getDb - No existing connection, creating new one");
    db = await createDbConnection(SERVER_DB_CONF);
    await db.query(INIT_DB_QUERY);
    // dLog("getDb - New connection established successfully");

    return db;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    dLog("getDb - Failed to connect to SurrealDB", {
      error: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err;
  }
}
export async function closeDashboardDb(): Promise<void> {
  if (!db) return;
  await db.close();
  db = undefined;
}

export const createDbConnection = async (conf: typeof SERVER_DB_CONF) => {
  const { host, namespace, database, username, password } = conf;
  const isEmbedded = host.startsWith("mem://") || host.startsWith("surrealkv://");
  const db = new Surreal(isEmbedded ? { engines: surrealdbNodeEngines() } : undefined);
  await db.connect(host, {
    namespace: namespace,
    database: database,
  });
  if (isEmbedded) return db;
  await db.signin({
    username: username,
    password: password,
  });
  return db;
};
