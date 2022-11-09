import { ormMapQuestion as _mapQuestion } from "../model/question-orm.js";
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

export async function mapQuestionsDone(req, res) {
	try {

		console.log(req.body)
		const easyQuestions = req.body.dashboardHistory.easyQuestions;
		const mediumQuestions = req.body.dashboardHistory.mediumQuestions;
		const hardQuestions = req.body.dashboardHistory.hardQuestions;
		
		let history = [];
		let temp;

		if (easyQuestions !== undefined) {
			for (let i = 0; i < easyQuestions.length; i++) {
				temp = await _mapQuestion(easyQuestions[i]);
				history.push({
					'ProblemID': temp.id,
					'ProblemName': temp.title,
					'Difficulty': "Easy"
				});
			}
		}

		if (mediumQuestions !== undefined) {
			for (let i = 0; i < mediumQuestions.length; i++) {
				temp = await _mapQuestion(mediumQuestions[i]);
				history.push({
					'ProblemID': temp.id,
					'ProblemName': temp.title,
					'Difficulty': "Medium"
				});
			}
		}

		if (hardQuestions !== undefined) {
			for (let i = 0; i < hardQuestions.length; i++) {
				temp = await _mapQuestion(hardQuestions[i]);
				history.push({
					'ProblemID': temp.id,
					'ProblemName': temp.title,
					'Difficulty': "Hard"
				});
			}
		}

		return res.status(200).json(history);
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message:
				"Controller ERROR: Database failure when finding question!",
		});
	}
}
