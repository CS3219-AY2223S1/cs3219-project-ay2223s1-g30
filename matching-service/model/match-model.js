import mongoose from "mongoose";
var Schema = mongoose.Schema;
let MatchModelSchema = new Schema({
    matchId: {
        type: String,
        required: true,
        unique: true,
    },
    user1: {
        type: String,
        required: true,
        unique: true,
    },
    user2: {
        type: String,
        required: true,
        unique: true,
    },
});

export default mongoose.model("MatchModel", MatchModelSchema);