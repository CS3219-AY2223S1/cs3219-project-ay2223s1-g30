import { findQuestion } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence

export async function ormFindQuestion() {
	try {
		return findQuestion();
	} catch (err) {
		console.log("ORM ERROR: Could not find question");
		return { err };
	}
}
