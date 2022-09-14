import express from "express";
import cors from "cors";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
import {
	createUser,
	deleteUser,
	loginUser,
	getMe,
	updateUser,
} from "./controller/user-controller.js";

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get("/", (_, res) => res.send("Hello World from user-service"));
router.post("/", createUser);
router.delete("/:username", deleteUser);
router.put("/:username", updateUser);
router.get("/login", (_, res) => res.send("Hello World from login"));
router.post("/login", loginUser);
router.get("/dashboard", getMe);

app.use("/api/user", router).all((_, res) => {
	res.setHeader("content-type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(8000, () => console.log("user-service listening on port 8000"));
