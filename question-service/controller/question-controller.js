import { ormGetQuestion as _getQuestion } from "../model/question-orm.js";

export async function getQuestion(req, res) {
	try {
		const questions = await _getQuestion();
		return res.status(200).json(questions);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message:
				"Controller ERROR: Database failure when geting question!",
		});
	}
}
