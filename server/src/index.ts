import App from "@/app";
import IndexRoute from "./routes/index.route";
import AuthRoute from "./routes/auth.route";
import ChatRoute from "./routes/chat.route";
import http from "http";

import { Session } from "express-session";
import { User } from "@interfaces/user.interfaces";
import SocketServer from "./socketServer";

declare module "http" {
    interface IncomingMessage {
        session: Session & {
            user: User;
        };
    }
}

const app = new App([new IndexRoute(), new AuthRoute(), new ChatRoute()]);

const httpServer = http.createServer(app.app);

new SocketServer(httpServer);

httpServer.listen(app.port, () => {
    console.log(`[INFO] Server is listening on ${app.port}`);
});
