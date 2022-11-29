import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import { SECRET_KEY } from "@/config";
import { User } from "@interfaces/user.interfaces";
import { RequestHandler } from "express";

let cachedSessionMiddleware: RequestHandler;

const sessionMiddleware = () => {
    const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const minuteInMilliseconds = 60 * 1000;
    const prisma = new PrismaClient();

    const store = new PrismaSessionStore(prisma as any, {
        checkPeriod: minuteInMilliseconds,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    });

    if (cachedSessionMiddleware) {
        return cachedSessionMiddleware;
    }
    cachedSessionMiddleware = session({
        cookie: {
            maxAge: weekInMilliseconds,
        },
        secret: SECRET_KEY,
        resave: true,
        saveUninitialized: true,
        store,
    });

    return cachedSessionMiddleware;
};

export default sessionMiddleware;
