import process from "node:process";

export const MONGO_IP = process.env.MONGO_IP || "suzuchi-ginkou-database"
export const MONGO_PORT = process.env.MONGO_PORT || 27017
export const MONGO_USER = process.env.MONGO_USER
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD
export const SESSION_SECRET = process.env.SESSION_SECRET || 'session-secret-not-set'


// module.exports = {
//     MONGO_IP: process.env.MONGO_IP || "suzuchi-ginkou-database",
//     MONGO_PORT: process.env.MONGO_PORT || 27017,
//     MONGO_USER: process.env.MONGO_USER,
//     MONGO_PASSWORD: process.env.MONGO_PASSWORD,
//     SESSION_SECRET: process.env.SESSION_SECRET
// }