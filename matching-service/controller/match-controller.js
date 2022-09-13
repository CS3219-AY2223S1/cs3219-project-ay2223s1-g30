import { ormCreateMatch as _createMatch } from "../model/match-orm.js";
import { ormCheckMatch as _checkMatch } from "../model/match-orm.js";


export async function createMatch(req, res) {
    try {
        const { isPendingMatch, user1, user2 } = req.body;
        if (isPendingMatch != "true" && isPendingMatch != "false") {
            return res
                .status(400)
                .json({ message: "isPendingMatch should be either true or false." });
        }
      
        if (isPendingMatch && user1) {
            const matchExist = await _checkMatch(user1);
            if (matchExist) {
                return res.status(409).json({
                    message:
                        "User1 is already in a match. Please choose another user!",
                });
            }
            const resp = await _createMatch(isPendingMatch, user1, user2);
            console.log(resp);
            if (resp.err) {
                return res
                    .status(400)
                    .json({ message: "Could not create a new match!" });
            } else {
                console.log(`Created new match between ${user1} and ${user2} successfully!`);
                return res.status(201).json({
                    message: `Created new match between ${user1} and ${user2} successfully!`,
                });
            }
        } else {
            return res
                .status(400)
                .json({ message: "Please provide at least isPendingMatch and user1!" });
        }
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Database failure when creating new match!" });
    }
}