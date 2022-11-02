import express from "express";
import cors from "cors";

const app = express();
const endpoint = process.env.PORT;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: endpoint })); // config cors so that front-end can use
app.options("*", cors());


import { getQuestion, mapQuestionsDone} from "./controller/question-controller.js";

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get("/", (_, res) => res.send("Hello World from question-service"));
router.get("/question", getQuestion);
router.post("/question", mapQuestionsDone);
router.get("/question", getQuestion);

app.use("/api", router).all((_, res) => {
	res.setHeader("content-type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
});

app.listen(8002, () => console.log("question-service listening on port 8002"));
