import { getQuestion, mapQuestion } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence

export async function ormGetQuestion() {
	try {
		return getQuestion();
	} catch (err) {
		console.log("ORM ERROR: Could not find question");
		return { err };
	}
}

export async function ormMapQuestion(questionId) {
	try {
		const question = await mapQuestion({id: questionId})
		return question;
	} catch (err) {
		console.log("ERROR: Could not check for user");
		return { err };
	}
}
