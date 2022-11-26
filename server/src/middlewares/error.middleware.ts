import { NextFunction, Request, Response } from "express";
import { OperationalError } from "@errors/OperationalError";

const errorMiddleware = (
    error: OperationalError | Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        console.error(error);
        if (error instanceof OperationalError) {
            return error.sendError(res);
        } else {
            return res.status(500).json({
                status: "fail",
                message: "Something went wrong. Try later",
            });
        }
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
