import { Response } from "express";

export class OperationalError extends Error {
    public status: "fail";
    public message: string;
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.status = "fail";
        this.message = message;
        this.statusCode = statusCode;
    }

    public sendError(res: Response) {
        return res
            .status(this.statusCode)
            .json({ status: this.status, message: this.message });
    }
}
