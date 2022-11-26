import { CreateUserDto, UserDto } from "@/dtos/user.dto";
import AuthService from "@/services/auth.service";
import { NextFunction, Request, Response } from "express";
import { OperationalError } from "@/errors/OperationalError";

class AuthController {
    public authService = new AuthService();

    public signup = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const userData: CreateUserDto = req.body;
            const createdUserData = await this.authService.signup(userData);

            req.session.user = {
                id: createdUserData.id,
                email: createdUserData.email,
                name: createdUserData.name,
            };

            res.status(201).json({
                status: "ok",
                message: "created user",
                user: req.session.user,
            });
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
            const userData: UserDto = req.body;
            const user = await this.authService.login(userData);

            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name,
            };

            res.status(200).json({ status: "ok", user: req.session.user });
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
            await new Promise((resolve, reject) => {
                req.session.destroy(err => {
                    if (err)
                        reject(new OperationalError("Could not log out", 500));
                    resolve(null);
                });
            });

            res.status(200).json({ status: "ok" });
        } catch (error) {
            next(error);
        }
    };

    public fetchUser = (req: Request, res: Response, next: NextFunction) => {
        if (req.sessionID && req.session?.user) {
            return res
                .status(200)
                .json({ status: "ok", user: req.session.user });
        } else {
            next(new OperationalError("Forbidden", 403));
        }
    };
}

export default AuthController;
