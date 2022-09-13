import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

const httpServer = createServer(app)

httpServer.listen(8001);

const io = new Server(httpServer, {
    /* socket.io options */
    cors: {
        origin: '*',
      }
});

io.on("connection", (socket) => {
    console.log(`Received a connection request with ID: ${socket.id}`)
    //For testing with Postman
    socket.on("message", function (data) {
        console.log("data: " + data);
    });
});

