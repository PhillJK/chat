import { config } from "dotenv";
config();

const CREDENTIALS = process.env.CREDENTIALS === "true";
const PORT =
    typeof process.env.PORT === "string" || typeof process.env.PORT === "number"
        ? process.env.PORT
        : 3000;
const ORIGIN =
    typeof process.env.ORIGIN === "string" ? process.env.ORIGIN : "*";

const LOG_FORMAT =
    typeof process.env.LOG_FORMAT === "string" ? process.env.LOG_FORMAT : "dev";

const SECRET_KEY =
    typeof process.env.SECRET_KEY === "string"
        ? process.env.SECRET_KEY
        : "secret";

const HOST =
    typeof process.env.HOST === "string"
        ? process.env.HOST
        : "http://localhost";

export { PORT, ORIGIN, CREDENTIALS, LOG_FORMAT, SECRET_KEY, HOST };
