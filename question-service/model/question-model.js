import mongoose from "mongoose";
var Schema = mongoose.Schema;
let QuestionModelSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		difficulty: {
			type: String,
			required: true,
		},
		question: {
			type: String,
			required: true,
		},
		examples: [
			{
				type: String,
			},
		],
		constraints: [
			{
				type: String,
			},
		],
	},
	{ collection: "questions" }
);

export default mongoose.model("QuestionModel", QuestionModelSchema);
