import { ormFindQuestion as _findQuestion } from "../model/question-orm.js";

export async function findQuestion(req, res) {
	try {
		const questions = await _findQuestion();
		return res.status(200).json(questions);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message:
				"Controller ERROR: Database failure when finding question!",
		});
	}
}
