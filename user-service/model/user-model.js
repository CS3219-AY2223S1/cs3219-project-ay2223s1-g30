import mongoose from "mongoose";
var Schema = mongoose.Schema;
let UserModelSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	easy: [
		{
			type: String,
			default: undefined,
		},
	],
	medium: [
		{
			type: String,
			default: undefined,
		},
	],
	hard: [
		{
			type: String,
			default: undefined,
		},
	],
});

export default mongoose.model("UserModel", UserModelSchema);
