import express from "express";
import { json, urlencoded } from "body-parser";
import pinoLogger from "express-pino-logger";
import cors from "cors";
import config from "./config";
import { signup, login, protect, logout } from "./utils/auth";
import { connect } from "./utils/db";
import userRouter from "./resources/user/user.router";
import quesRouter from "./resources/ques/ques.router";
import replyRouter from "./resources/replies/reply.router";
// import adminRouter from "./resources/admin/admin.router";
export const app = express();

app.disable("x-powered-by");
app.use(pinoLogger());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
// app.use(morgan("dev"));

// User Auth routes
app.post("/signup", signup);
app.post("/login", login);
app.delete("/logout", logout);

// Auth middleware
app.use("/api", protect);

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/quest", quesRouter);
app.use("/api/reply", replyRouter);
// app.use("/admin", isAdmin, adminRouter);
export const start = async () => {
	try {
		await connect();
		app.listen(config.port, () => {
			console.log(`REST API on http://localhost:${config.port}/api`);
		});
	} catch (e) {
		console.error(e);
	}
};
