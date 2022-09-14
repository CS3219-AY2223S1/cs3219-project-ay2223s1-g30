import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import axios from "axios";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());
import { createMatch, deleteMatch } from './controller/match-controller.js';

const router = express.Router();

router.get('/', (_, res) => res.send('Hello World from matching-service'));
router.post('/', createMatch);
router.delete('/:userID', deleteMatch);

app.use('/api/match', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

const httpServer = createServer(app)

const io = new Server(httpServer, {
    /* socket.io options */
    cors: {
        origin: ["https://admin.socket.io", '*'],
        credentials: true
    }
});

// For socket.io admin UI
instrument(io, {
    auth: false
});

httpServer.listen(8001);

const URL_MATCH_SERVICE = "http://localhost:8001/api/match";

const res = await axios.get(URL_MATCH_SERVICE);
console.log(`Axios Test: ${res.data}`);

io.on("connection", (socket) => {
    console.log(`Received a connection request via socket id: ${socket.id}`);

    socket.on('match', async (currentUser, difficulty, currentUserSocketId) => {
        console.log(`Received match request: (${currentUser}, ${difficulty}, ${currentUserSocketId})`);
        console.log("Start Axios call (match)");
        const res = await axios.post(URL_MATCH_SERVICE, { difficulty, currentUser, currentUserSocketId })
            .catch((err) => {
                console.log(`Axios error in matching-service/index.js (match): ${err}`);
            });
        console.log("Axios complete (match)");

        if (res) {
            console.log(res.data);
            if (!res.data.isPendingMatch) {
                const collabRoom = (res.data.collabRoomSocketId);
                const pendingUserSocketId = res.data.user2SocketId;
                // Send matchSuccess to both users in complete match
                socket.emit('matchSuccess', collabRoom);
                io.to(pendingUserSocketId).emit('matchSuccess', collabRoom);

                // Push matched client into collab room.
                socket.join(collabRoom);
            } else {
                // Push pending client into collab room.
                const collabRoom = (res.data.collabRoomSocketId);
                socket.join(collabRoom);
            }
        } else {
            console.log("Axios: No result data.")
        }

    })

    socket.on('leave-match', async (currentUser) => {
        console.log(`Received leave-match request: (${currentUser})`);
        console.log("Start Axios call (leave-match)");
        const URL_DELETE_MATCH = URL_MATCH_SERVICE + "/" + currentUser;
        const res = await axios.delete(URL_DELETE_MATCH, { currentUser })
            .catch((err) => {
                console.log(`Axios error in matching-service/index.js (leave-match): ${err}`);
            });
        console.log("Axios complete (leave-match)");

        if (res) {
            console.log(res.data);
            const collabRoom = res.data.collabRoomSocketId;
            socket.emit('matchFail', collabRoom)

            // Push client out of room
            socket.leave(collabRoom);
        } else {
            console.log("Axios: No result data.")
        }

    })

    //For testing with Postman
    socket.on("message", function (data) {
        console.log(data)
    });
});
