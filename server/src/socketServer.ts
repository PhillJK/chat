import { Server as HTTPserver } from "http";
import { Server } from "socket.io";
import sessionMiddleware from "./middlewares/session.middleware";
import { NextFunction, Request, Response } from "express";
import { OperationalError } from "./errors/OperationalError";
import { ORIGIN, PORT } from "@config";
import { Message, PrismaClient } from "@prisma/client";
import { writeFile } from "fs";
import { v4 as uuid } from "uuid";
import { HOST } from "@config";

class SocketServer {
    public io: Server;
    public users: Map<number, string>;
    public prisma: PrismaClient;

    constructor(server: HTTPserver) {
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cors: {
                origin: ORIGIN,
                credentials: true,
            },
            maxHttpBufferSize: 1e8,
        });

        this.prisma = new PrismaClient();

        this.users = new Map();

        this.initializeMiddlewares();
        this.initializeEvents();
    }

    private sendMessage(to: string, message: Message) {
        this.io.to(to).emit("message_receive", message);
    }

    private getSocketIdFromUserId(userId: number) {
        return this.users.get(userId);
    }

    private initializeEvents() {
        this.io.on("connection", socket => {
            const userId = socket.request.session.user.id;

            this.users.set(userId, socket.id);

            socket.on("message_send", async (data, cb) => {
                if (!data.content?.trim?.()) return;

                const socketIdOfReceiver = this.getSocketIdFromUserId(data.to);

                const message = await this.prisma.message.create({
                    data: {
                        type: "Text",
                        chatId: data.chatId,
                        fromId: userId,
                        text: data.content,
                    },
                });

                cb(message);

                if (socketIdOfReceiver) this.sendMessage(socketIdOfReceiver, message);
            });

            socket.on("message_send_file", async (file, data, cb) => {
                const socketIdOfReceiver = this.getSocketIdFromUserId(data.to);
                const filename = `${uuid()}.${data.ext}`;

                writeFile(`./public/${filename}`, file, async err => {
                    if (err) {
                        return cb({ error: true });
                    }

                    const url = `${HOST}:${PORT}/static/${filename}`;

                    const message = await this.prisma.message.create({
                        data: {
                            type: "File",
                            chatId: data.chatId,
                            fromId: userId,
                            url,
                        },
                    });

                    cb({ error: false, ...message });

                    if (socketIdOfReceiver) this.sendMessage(socketIdOfReceiver, message);
                });
            });

            socket.on("disconnect", () => {
                this.users.delete(userId);
            });
        });
    }

    private initializeMiddlewares() {
        this.io.use((socket, next) =>
            sessionMiddleware()(socket.request as Request, {} as Response, next as NextFunction),
        );

        this.io.use((socket, next) => {
            if (socket.request.session?.user?.id) next();
            else next(new OperationalError("Forbidden", 403));
        });
    }
}

export default SocketServer;
