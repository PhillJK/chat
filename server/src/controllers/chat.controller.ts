import { AddChatToUserDto } from "@/dtos/chat.dto";
import ChatService from "@/services/chat.service";
import { NextFunction, Request, Response } from "express";

class ChatController {
    public chatService = new ChatService();

    public getChatsOfUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chats = await this.chatService.getUserChats(req.session?.user?.id as number);

            res.status(200).json({ status: "ok", chats });
        } catch (error) {
            next(error);
        }
    };

    public findUserChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query.name as string;

            const users = await this.chatService.findUsers(query);

            res.status(200).json({ status: "ok", users });
        } catch (error) {
            next(error);
        }
    };

    public addChatToUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: AddChatToUserDto = req.body;

            const chat = await this.chatService.addChatToUser(req.session?.user?.id as number, body.userId);

            res.status(201).json({ status: "ok", chat });
        } catch (error) {
            next(error);
        }
    };

    public getChatMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chatId = Number(req.params?.id);

            const messages = await this.chatService.getMessages(chatId);

            res.status(200).json({ status: "ok", messages });
        } catch (error) {
            next(error);
        }
    };
}

export default ChatController;
