import MatchModel from "./match-model.js";
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

export async function createMatch(params) {
	return new MatchModel(params);
}

export async function checkMatch(params) {
	return MatchModel.findOne(params);
}

export async function deleteMatch(params) {
	return MatchModel.findOneAndDelete(params);
}
