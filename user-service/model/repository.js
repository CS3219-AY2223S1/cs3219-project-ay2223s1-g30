import UserModel from "./user-model.js";
import TokenModel from "./token-model.js";
import "dotenv/config";

//Set up mongoose connection
import mongoose from "mongoose";

let mongoDB =
	process.env.ENV == "PROD"
		? process.env.DB_CLOUD_URI
		: process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function createUser(params) {
	return new UserModel(params);
}

export async function checkUser(params) {
	return UserModel.findOne(params);
}

export async function deleteUser(params) {
	return UserModel.deleteOne(params);
}

export async function updatePassword(param1, param2) {
	return UserModel.findByIdAndUpdate(param1, param2);
}

export async function createToken(params) {
	return new TokenModel(params);
}

export async function checkToken(params) {
	return TokenModel.findOne(params);
}

export async function updateHistory(param1, param2) {
	return UserModel.findByIdAndUpdate(param1, param2);
}
