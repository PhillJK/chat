import App from "@/app";
import IndexRoute from "./routes/index.route";
import AuthRoute from "./routes/auth.route";
import ChatRoute from "./routes/chat.route";

const app = new App([new IndexRoute(), new AuthRoute(), new ChatRoute()]);

app.listen();
