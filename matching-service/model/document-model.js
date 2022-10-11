import mongoose from "mongoose";
var Schema = mongoose.Schema;
let DocumentModelSchema = new Schema({
    _id: String,
    data: Object
});

export default mongoose.model("DocumentModel", DocumentModelSchema);
