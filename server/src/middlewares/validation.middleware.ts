import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { OperationalError } from "@errors/OperationalError";

const validationMiddleware = (
    type: any,
    value: string | "body" | "query" | "params" = "body",
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true,
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        type RequestData = keyof typeof req;

        const body = req[value as RequestData];
        validate(plainToInstance(type, body), {
            skipMissingProperties,
            whitelist,
            forbidNonWhitelisted,
        }).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const message = errors
                    .map((error: ValidationError) => {
                        if (error.constraints) {
                            return Object.values(error.constraints);
                        }
                    })
                    .join(", ");
                next(new OperationalError(message, 400));
            } else {
                next();
            }
        });
    };
};

export default validationMiddleware;
