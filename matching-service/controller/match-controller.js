import { ormCreateMatch as _createMatch } from "../model/match-orm.js";
import { ormCheckMatch as _checkMatch } from "../model/match-orm.js";


export async function createMatch(req, res) {
    try {
        const { matchId, user1, user2 } = req.body;
        if (matchId && user1 && user2) {
            const matchExist = await _checkMatch(matchId);
            if (matchExist) {
                return res.status(409).json({
                    message:
                        "MatchId is already in use. Please choose another MatchId!",
                });
            }
            const resp = await _createMatch(matchId, user1, user2);
            console.log(resp);
            if (resp.err) {
                return res
                    .status(400)
                    .json({ message: "Could not create a new match!" });
            } else {
                console.log(`Created new match (ID: ${matchId}) between ${user1} and ${user2} successfully!`);
                return res.status(201).json({
                    message: `Created new match (ID: ${matchId}) between ${user1} and ${user2} successfully!`,
                });
            }
        } else {
            return res
                .status(400)
                .json({ message: "Please fill in all fields!" });
        }
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Database failure when creating new match!" });
    }
}