import { OperationalError } from "@/errors/OperationalError";
import { Chat, User } from "@/interfaces/chat.interfact";
import { isEmpty } from "@/utils/util";
import { PrismaClient } from "@prisma/client";
import { exclude } from "@utils/util";

class ChatService {
    private prisma = new PrismaClient();
    public users = this.prisma.user;
    public chats = this.prisma.chat;
    public messages = this.prisma.message;

    public async getUserChats(id: number) {
        if (isEmpty(id))
            throw new OperationalError("User id is not defined", 400);

        const user = await this.users.findUnique({
            where: { id: id },
            include: {
                chats: {
                    include: {
                        participants: true,
                    },
                },
            },
        });

        const chats: Chat[] = [];

        // Exclude unnecassary fields from participants
        user?.chats.forEach(chat => {
            const participants = chat.participants.map(user =>
                exclude(user, ["password", "email", "createdAt", "updatedAt"]),
            );

            chats.push({ ...chat, participants });
        });

        return chats;
    }

    public async findUsers(name: string) {
        if (isEmpty(name)) throw new OperationalError("Name is empty", 400);

        const usersData = await this.users.findMany({
            where: { name: name },
        });

        //Exclude unnecassary fields from users
        const users: User[] = usersData.map(user =>
            exclude(user, ["password", "email", "createdAt", "updatedAt"]),
        );

        return users;
    }

    public async addChatToUser(userId: number, otherUserId: number) {
        if (isEmpty(userId))
            throw new OperationalError("Id is not defined", 400);
        if (isEmpty(otherUserId))
            throw new OperationalError(
                "Participants user id is not defined",
                400,
            );

        const isChatExists = await this.chats.findFirst({
            where: {
                participants: {
                    every: {
                        id: {
                            in: [otherUserId, userId],
                        },
                    },
                },
            },
        });

        if (isChatExists)
            throw new OperationalError("Chat already exists", 400);

        const chatData = await this.chats.create({
            data: {
                participants: {
                    connect: [{ id: userId }, { id: otherUserId }],
                },
            },
            include: {
                participants: true,
            },
        });

        //Exclude unnecassary fields from participants
        const participants: User[] = chatData.participants.map(user =>
            exclude(user, ["password", "email", "createdAt", "updatedAt"]),
        );

        const chat = { ...chatData, participants };

        return chat;
    }

    public async getMessages(chatId: number) {
        if (isEmpty(chatId))
            throw new OperationalError("Chat id is not defined", 400);

        const messages = await this.messages.findMany({ where: { chatId } });

        return messages;
    }
}

export default ChatService;
