import dotenv from "dotenv";
import { Logger } from "./util/Logger";

dotenv.config();

const {
  TOKEN,
  CLIENT_ID,
  PREFIX,
  DB_CONN_STRING,
  USERS_DB_NAME,
  SETTINGS_DB_NAME,
  SETTINGS_COLLECTION_NAME,
} = process.env;

if (
  !TOKEN ||
  !CLIENT_ID ||
  !PREFIX ||
  !DB_CONN_STRING ||
  !USERS_DB_NAME ||
  !SETTINGS_DB_NAME ||
  !SETTINGS_COLLECTION_NAME
) {
  Logger.getInstance().error("Missing environment variables");
  Error("Missing environment variables");
}

export default {
  TOKEN,
  CLIENT_ID,
  PREFIX,
  DB_CONN_STRING,
  USERS_DB_NAME,
  SETTINGS_DB_NAME,
  SETTINGS_COLLECTION_NAME,
};
