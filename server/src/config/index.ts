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

export { PORT, ORIGIN, CREDENTIALS, LOG_FORMAT };
