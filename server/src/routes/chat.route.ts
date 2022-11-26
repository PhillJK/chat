import { Routes } from "@/interfaces/routes.interfaces";
import { Router } from "express";
import ChatController from "@/controllers/chat.controller";
import validationMiddleware from "@/middlewares/validation.middleware";
import { AddChatDto } from "@/dtos/chat.dto";

class ChatRoute implements Routes {
    public path = "/chat/";
    public router = Router();
    public chatController = new ChatController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}find`, this.chatController.findUserChat);
        this.router.get(`${this.path}:id`, this.chatController.getChatMessages);
        this.router.get(
            `${this.path}user/:id`,
            this.chatController.getChatsOfUser,
        );
        this.router.post(
            `${this.path}addChat`,
            validationMiddleware(AddChatDto, "body"),
            this.chatController.addChatToUser,
        );
    }
}

export default ChatRoute;
