import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const USER_NAME = process.env.MONGO_USER;
const PASSWORD = process.env.MONGO_PASSWORD;
const DB_NAME = process.env.MONGO_DB_NAME;
const CLUSTER = process.env.MONGO_CLUSTER;
//??
const MONGODB_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@${CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;
class Database {
    constructor() {
        this.client = new MongoClient(MONGODB_URI);
        this.db = null;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        if (!this.db) {
            try {
                await this.client.connect();
                console.log(`[INFO] Database Connected: ${DB_NAME}`);
                this.db = this.client.db(DB_NAME);
            }
            catch (error) {
                console.error("[ERROR] Database failed to connect: ", error);
                throw error;
            }
        }
        return this.db;
    }
    async disconnect() {
        await this.client.close();
        console.log("[INFO] Database Disconnected to MongoDB");
        this.db = null;
    }
}
export default Database;
//# sourceMappingURL=database.js.map