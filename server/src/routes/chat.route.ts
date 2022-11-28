import { Routes } from "@/interfaces/routes.interfaces";
import { Router } from "express";
import ChatController from "@/controllers/chat.controller";
import validationMiddleware from "@/middlewares/validation.middleware";
import { AddChatToUserDto } from "@/dtos/chat.dto";
import authMiddleware from "@/middlewares/auth.middleware";

class ChatRoute implements Routes {
    public path = "/chat/";
    public router = Router();
    public chatController = new ChatController();

    constructor() {
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}find`, this.chatController.findUserChat);
        this.router.get(`${this.path}user`, this.chatController.getChatsOfUser);
        this.router.get(`${this.path}:id`, this.chatController.getChatMessages);
        this.router.post(
            `${this.path}addChat`,
            validationMiddleware(AddChatToUserDto, "body"),
            this.chatController.addChatToUser,
        );
    }

    private initializeMiddlewares() {
        this.router.use(`${this.path}`, authMiddleware);
    }
}

export default ChatRoute;
