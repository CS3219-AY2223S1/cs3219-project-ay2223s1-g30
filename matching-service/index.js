import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
//const { Server } = require("socket.io");

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

const httpServer = createServer(app)
//const io = new Server(httpServer, { /* options */ });

//io.on("connection", (socket) => {
    // ...
//});

httpServer.listen(8001);
