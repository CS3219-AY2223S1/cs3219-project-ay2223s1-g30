import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from "socket.io";

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
    console.log(`Received a connection request with ID: ${socket.id}`)
    socket.on('match-request', (string) => {
        console.log(`Received this message: ${string}`)
        socket.emit('match', `Created a match object for ${socket.id}`)
    })

    //For testing with Postman
    socket.on("message", function (data) {
        console.log(data)
    });
});

httpServer.listen(8001);
