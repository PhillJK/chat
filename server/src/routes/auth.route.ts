import { Router } from "express";
import AuthController from "@/controllers/auth.controller";
import { Routes } from "@/interfaces/routes.interfaces";

class IndexRoute implements Routes {
    public path = "/auth/";
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}signup`, this.authController.signup);
        this.router.post(`${this.path}login`, this.authController.login);
        this.router.post(`${this.path}logout`, this.authController.logout);
    }
}

export default IndexRoute;
