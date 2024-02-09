import dotenv from "dotenv";

dotenv.config();

const {
  TOKEN,
  CLIENT_ID,
  PREFIX,
  DB_CONN_STRING,
  DB_NAME,
  USERS_COLLECTION_NAME,
} = process.env;

if (
  !TOKEN ||
  !CLIENT_ID ||
  !PREFIX ||
  !DB_CONN_STRING ||
  !DB_NAME ||
  !USERS_COLLECTION_NAME
) {
  throw new Error("Missing environment variables");
}

export default {
  TOKEN,
  CLIENT_ID,
  PREFIX,
  DB_CONN_STRING,
  DB_NAME,
  USERS_COLLECTION_NAME,
};
