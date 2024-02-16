import { ObjectId } from "mongodb";

export default interface ServerSettings {
  _id: ObjectId;
  guildId: string;
  botChannelId: string;
}
