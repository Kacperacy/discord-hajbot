"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const { TOKEN, CLIENT_ID, PREFIX, DB_CONN_STRING, DB_NAME, USERS_COLLECTION_NAME, } = process.env;
if (!TOKEN ||
    !CLIENT_ID ||
    !PREFIX ||
    !DB_CONN_STRING ||
    !DB_NAME ||
    !USERS_COLLECTION_NAME) {
    throw new Error("Missing environment variables");
}
exports.default = {
    TOKEN,
    CLIENT_ID,
    PREFIX,
    DB_CONN_STRING,
    DB_NAME,
    USERS_COLLECTION_NAME,
};
