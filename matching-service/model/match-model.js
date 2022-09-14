import mongoose from "mongoose";
var Schema = mongoose.Schema;
let MatchModelSchema = new Schema({
    isPendingMatch: {
        type: Boolean,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    user1: {
        type: String,
        required: true,
        unique: true,
    },
    user2: {
        type: String,
        required: false,
        unique: false,
    },
    user1SocketId: {
        type: String,
        required: true,
        unique: false,
    },
    user2SocketId: {
        type: String,
        required: false,
        unique: false,
    },
    collabRoomSocketId: {
        type: String,
        required: true,
        unique: false,
    },
});

export default mongoose.model("MatchModel", MatchModelSchema);