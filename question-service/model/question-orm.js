import { getQuestion } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence

export async function ormGetQuestion() {
	try {
		return getQuestion();
	} catch (err) {
		console.log("ORM ERROR: Could not find question");
		return { err };
	}
}
