import { NextFunction, Request, Response } from "express";

class AuthController {
    public signup = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            res.status(200).json({ status: "ok", message: "Hello World" });
        } catch (error) {
            next(error);
        }
    };

    public login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            res.status(200).json({ status: "ok", message: "Hello World" });
        } catch (error) {
            next(error);
        }
    };

    public logout = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            res.status(200).json({ status: "ok", message: "Hello world" });
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
