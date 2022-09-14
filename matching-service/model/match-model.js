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
});

export default mongoose.model("MatchModel", MatchModelSchema);