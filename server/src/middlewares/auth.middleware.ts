import { OperationalError } from "@/errors/OperationalError";
import { NextFunction, Request, Response } from "express";

const authMiddleware = (req: Request, _: Response, next: NextFunction) => {
    if (!req.session?.user?.id) throw new OperationalError("Forbiden", 403);
    next();
};

export default authMiddleware;
