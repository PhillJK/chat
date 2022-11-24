import express from "express";
import { PORT, ORIGIN, CREDENTIALS, LOG_FORMAT } from "@config";
import { Routes } from "@interfaces/routes.interfaces";
import morgan from "morgan";
import cors from "cors";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorMiddleware from "@/middlewares/error.middleware";
import sessionMiddleware from "./middlewares/session.middleware";

class App {
    public app: express.Application;
    public port: string | number;

    constructor(routes: Routes[]) {
        this.app = express();
        this.port = PORT;

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`[INFO] Server is listening on ${this.port}`);
        });
    }

    private initializeMiddlewares() {
        this.app.use(morgan(LOG_FORMAT));
        this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
        this.app.use(hpp());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(sessionMiddleware());
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            this.app.use("/api/", route.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;
