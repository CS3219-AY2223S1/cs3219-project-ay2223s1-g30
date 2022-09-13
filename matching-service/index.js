import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from "socket.io";
import axios from "axios";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());
import { createMatch } from './controller/match-controller.js';

const router = express.Router();

router.get('/', (_, res) => res.send('Hello World from matching-service'));
router.post('/', createMatch);

app.use('/api/match', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

const httpServer = createServer(app)

const io = new Server(httpServer, {
    /* socket.io options */
});

io.on("connection", (socket) => {
    console.log(`Received a connection request via socket id: ${socket.id}`)

    socket.on("match", function (data) {
        console.log(`match event taking place via socket id: ${data}`)
        //To check if someone is waiting, look for database object with
        //isPendingMatch == true.
        
        //if no one waiting,
        //add pending match to database

        //if another person is waiting,
        //remove pending match from database, add complete match

    });

    socket.on("leave-match", function (data) {
        console.log(`leave match event taking place via socket id: ${data}`)

        //make sure specified user is in database


        //remove the specified user from the database.
    });

    //For testing with Postman
    socket.on("message", function (data) {
        console.log(data)
    });

    //socket.on('match-request', (string) => {
    //    console.log(`Received this message: ${string}`)
    //    socket.emit('match', `Created a match object for ${socket.id}`)
    //})
});

httpServer.listen(8001);

// TODO: See if can work without Axios. (eg. direct call to createMatch)
const URL_MATCH_SERVICE = "http://localhost:8001/api/match";

const res = await axios.get("http://localhost:8001/api/match");
console.log(res.data);

const isPendingMatch = "true";
const user1 = "axios";
const user2 = "test";

const res2 = await axios
    .post("http://localhost:8001/api/match", { isPendingMatch, user1, user2 })
    .catch((err) => {
        //setErrorDialog("Axios error");
    });
//console.log(res2.data); //crashes app if axios.post was unsuccessful