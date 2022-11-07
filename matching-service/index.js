import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import axios from "axios";
import DocumentModel from "./model/document-model.js";

const app = express();
const endpoint = process.env.PORT || 8001;
const frontendEndpoint = "https://cs3219-g30-peerprep-test.netlify.app";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: endpoint })); // config cors so that front-end can use
app.options("*", cors());
import {
	createMatch,
	deleteMatch,
    getRoom,
    getSoloRoom,
} from "./controller/match-controller.js";

const router = express.Router();

router.get("/", (_, res) => res.send("Hello World from matching-service"));
router.post("/", createMatch);
router.post("/solo", getSoloRoom);
router.delete("/:userID", deleteMatch);
router.get("/:username", getRoom);

app.use("/api/match", router).all((_, res) => {
	res.setHeader("content-type", "application/json");
	res.setHeader("Access-Control-Allow-Origin", "*");
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
	/* socket.io options */
	cors: {
		origin: ["https://admin.socket.io", frontendEndpoint],
		credentials: true,
	},
});

// For socket.io admin UI
instrument(io, {
	auth: false,
});

httpServer.listen(endpoint);

const URL_MATCH_SERVICE = process.env.URI_MATCH_SERVICE || "http://localhost:8001/api/match";
const URL_SOLO_SERVICE = process.env.URI_SOLO_SERVICE || "http://localhost:8001/api/match/solo";

const res = await axios.get(URL_MATCH_SERVICE);
console.log(`Axios Test: ${res.data}`);

io.on("connection", (socket) => {
	console.log(`Received a connection request via socket id: ${socket.id}`);

	socket.on("match", async (currentUser, difficulty, currentUserSocketId) => {
		console.log(
			`Received match request: (${currentUser}, ${difficulty}, ${currentUserSocketId})`
		);
		console.log("Start Axios call (match)");
		const res = await axios
			.post(URL_MATCH_SERVICE, {
				difficulty,
				currentUser,
				currentUserSocketId,
			})
			.catch((err) => {
				console.log(
					`Axios error in matching-service/index.js (match): ${err}`
				);
			});
		console.log("Axios complete (match)");

		if (res) {
			console.log(res.data);
			if (!res.data.isPendingMatch) {
				const collabRoom = res.data.collabRoomSocketId;
				const pendingUserSocketId = res.data.user2SocketId;
				// Send matchSuccess to both users in complete match
				socket.emit("matchSuccess", collabRoom);
				io.to(pendingUserSocketId).emit("matchSuccess", collabRoom);

				// Push matched client into collab room.
				socket.join(collabRoom);
			} else {
				// Push pending client into collab room.
				const collabRoom = res.data.collabRoomSocketId;
				socket.join(collabRoom);
			}
		} else {
			console.log("Axios: No result data.");
		}
	});

	socket.on("leave-match", async (currentUser) => {
		console.log(`Received leave-match request: (${currentUser})`);
		console.log("Start Axios call (leave-match)");
		const URL_DELETE_MATCH = URL_MATCH_SERVICE + "/" + currentUser;
		const res = await axios
			.delete(URL_DELETE_MATCH, { currentUser })
			.catch((err) => {
				console.log(
					`Axios error in matching-service/index.js (leave-match): ${err}`
				);
			});
		console.log("Axios complete (leave-match)");

		if (res) {
			console.log(res.data);
			const collabRoom = res.data.collabRoomSocketId;
			socket.emit("matchFail", collabRoom);

			// Push client out of room
			socket.leave(collabRoom);
		} else {
			console.log("Axios: No result data.");
		}

		socket.on("save-document", async (data) => {
			await DocumentModel.findByIdAndUpdate(documentId, { data });
		});
	});

    // For solo practice mode
    socket.on('solo-practice', async (currentUser, difficulty, currentUserSocketId) => {
        console.log(`Solo practice request received: user ${currentUser}, difficulty ${difficulty}`);

        const res = await axios
            .post(URL_SOLO_SERVICE, {
                difficulty,
                currentUser,
                currentUserSocketId,
            })
            .catch((err) => {
                console.log(
                    `Axios error in matching-service/index.js (solo-practice): ${err}`
                );
            });
        console.log("Axios complete (solo-practice)");

        if (res) {
            console.log(res.data);
            const roomId = res.data.soloRoomSocketId;
            socket.emit("solo-practice-success", roomId);
        } else {
            console.log("Axios: No result data.");
        }
    })

	//For collaboration text editor
	socket.on("get-document", async (documentId) => {
		const document = await findDocument(documentId);
		socket.join(documentId);
		socket.emit("load-document", document.data);

		socket.on("send-changes", (delta) => {
			socket.broadcast.to(documentId).emit("receive-changes", delta);
		});

		socket.on("save-document", async (data) => {
			await DocumentModel.findByIdAndUpdate(documentId, { data });
		});
	});

    //For chat messaging
    socket.on('new-user', (name, collabRoomId) => {
        console.log(`New chat user: ${name} in ${collabRoomId}`);
        socket.join(collabRoomId);
        socket.broadcast.to(collabRoomId).emit('user-connected', name);
    })

    socket.on("send-chat-message", (message, userName, collabRoomId) => {
        console.log(`${userName} in ${collabRoomId} sends: ${message}`);
        socket.broadcast.to(collabRoomId).emit("chat-message", { message: message, name: userName });
    })

	//For testing with Postman
	socket.on("message", function (data) {
		console.log(data);
	});
});

const defaultValue = "";
async function findDocument(id) {
	if (id == null) return;

	const document = await DocumentModel.findById(id);
	if (document) {
		return document;
	} else {
		// No existing document found. Create a new document.
		return await DocumentModel.create({ _id: id, data: defaultValue });
	}
}

function sleep(noOfMilliseconds) {
	return new Promise((resolve) => setTimeout(resolve, noOfMilliseconds));
}
