import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authProtect } from "./middleware/authMiddleware.js";

const app = express();
const endpoint = process.env.PORT || 8000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: endpoint })); // config cors so that front-end can use
app.options("*", cors());
app.use(cookieParser());

import {
	createUser,
	deleteUser,
	loginUser,
	getMe,
	updatePassword,
	getProtectedMe,
	logoutUser,
	updateHistory,
	getHistory,
} from "./controller/user-controller.js";

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get("/", (_, res) => res.send("Hello World from user-service"));
router.post("/", createUser);
router.delete("/:username", authProtect, deleteUser);
router.put("/:username", authProtect, updatePassword);
router.get("/login", (_, res) => res.send("Hello World from login"));
router.post("/login", loginUser);
router.get("/dashboard/", authProtect, getProtectedMe);
router.post("/dashboard/", getMe);
router.post("/logout", logoutUser);
router.post("/history", updateHistory);
router.get("/history/:username", getHistory);

app.use("/api/user", router).all((_, res) => {
    res.setHeader("content-type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    //res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
});

app.listen(endpoint, () => console.log("user-service listening on port 8000"));
