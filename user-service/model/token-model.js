import mongoose from "mongoose";
var Schema = mongoose.Schema;
let TokenModelSchema = new Schema({
	token: {
		type: String,
		required: true,
		unique: true,
	},
}, {timestamps: true});

TokenModelSchema.index({createdAt: 1}, {expireAfterSeconds: 86400});

export default mongoose.model("TokenModel", TokenModelSchema);
