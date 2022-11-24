import { Router } from "express";
import AuthController from "@/controllers/auth.controller";
import { Routes } from "@/interfaces/routes.interfaces";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateUserDto, UserDto } from "@/dtos/user.dto";

class AuthRoute implements Routes {
    public path = "/auth/";
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}signup`,
            validationMiddleware(CreateUserDto, "body"),
            this.authController.signup,
        );
        this.router.post(
            `${this.path}login`,
            validationMiddleware(UserDto, "body"),
            this.authController.login,
        );
        this.router.get(`${this.path}logout`, this.authController.logout);
        this.router.get(
            `${this.path}fetch-user`,
            this.authController.fetchUser,
        );
    }
}

export default AuthRoute;
