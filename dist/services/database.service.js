"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.updateUser = exports.getTopStreaks = exports.getUser = exports.createUser = exports.collections = void 0;
const tslib_1 = require("tslib");
const mongoDB = tslib_1.__importStar(require("mongodb"));
const config_1 = tslib_1.__importDefault(require("../config"));
exports.collections = {};
async function createUser(discordId) {
    await exports.collections.users?.insertOne({
        discordId,
        yoCount: 1,
        yoTotal: 1,
        yoStreak: 1,
        yoBestStreak: 1,
        yoBestStreakDate: new Date(),
        yoLastDate: new Date(),
    });
}
exports.createUser = createUser;
async function getUser(discordId) {
    return (await exports.collections.users?.findOne({ discordId: discordId }));
}
exports.getUser = getUser;
async function getTopStreaks(amount) {
    return (await exports.collections.users
        ?.find()
        .sort({ yoBestStreak: -1 })
        .limit(amount)
        .toArray());
}
exports.getTopStreaks = getTopStreaks;
async function updateUser(discordId, update) {
    await exports.collections.users?.updateOne({ discordId: discordId }, { $set: update });
}
exports.updateUser = updateUser;
async function connectToDatabase() {
    const client = new mongoDB.MongoClient(config_1.default.DB_CONN_STRING);
    await client.connect();
    const db = client.db(config_1.default.DB_NAME);
    const usersCollection = db.collection(config_1.default.USERS_COLLECTION_NAME);
    exports.collections.users = usersCollection;
}
exports.connectToDatabase = connectToDatabase;
