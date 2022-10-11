import { ormCreateMatch as _createMatch } from "../model/match-orm.js";
import { ormCheckMatchUser1 as _checkMatchUser1 } from "../model/match-orm.js";
import { ormCheckMatchUser2 as _checkMatchUser2 } from "../model/match-orm.js";
import { ormFindPendingMatch as _findPendingMatch } from "../model/match-orm.js";
import { ormDeleteMatch as _deleteMatch } from "../model/match-orm.js";

var roomCounter = 1;

export async function createMatch(req, res) {
    try {
        const { difficulty, currentUser, currentUserSocketId } = req.body;

        if (difficulty != "easy" && difficulty != "medium" && difficulty != "hard") {
            console.log("Controller ERROR: Difficulty should be either easy, medium, or hard.");
            return res
                .status(400)
                .json({ message: "Controller ERROR: Difficulty should be either easy, medium, or hard." });
        }

        if (difficulty && currentUser && currentUserSocketId) {
            const matchExistUser1 = await _checkMatchUser1(currentUser);
            const matchExistUser2 = await _checkMatchUser2(currentUser);
            if (matchExistUser1 || matchExistUser2) {
                console.log(`Controller ERROR: currentUser (${currentUser}) is already in a match. Please choose another user!`)
                return res.status(409).json({
                    message:
                        "Controller ERROR: currentUser is already in a match. Please choose another user!",
                });
            }

            // Check if pendingMatch for specified difficulty exists
            const pendingMatchExist = await _findPendingMatch(difficulty);
            console.log(pendingMatchExist);
            if (pendingMatchExist) {
                console.log("pendingMatch exists!")
                // Get user1 in pendingMatch
                const pendingMatchUser = pendingMatchExist.user1;
                const pendingMatchId = pendingMatchExist._id;
                const pendingMatchUserSocketId = pendingMatchExist.user1SocketId;
                const pendingMatchCollabRoomSocketId = pendingMatchExist.collabRoomSocketId;

                // Remove pendingMatch from database
                console.log("Deleting pendingMatch from database.")
                const matchDeleted = await _deleteMatch(pendingMatchId);
                if (matchDeleted.err) {
                    console.log("Controller ERROR: Could not delete match!");
                    return res
                        .status(400)
                        .json({ message: "Controller ERROR: Could not delete match!" });
                } else {
                    console.log(`Deleted pendingMatch for ${pendingMatchUser} successfully!`);
                }

                // Add new complete match
                console.log("Adding new complete match to database.")
                const isPendingMatch = "false";
                const matchCreated = await _createMatch(isPendingMatch, difficulty, currentUser, pendingMatchUser,
                    currentUserSocketId, pendingMatchUserSocketId, pendingMatchCollabRoomSocketId);
                if (matchCreated.err) {
                    console.log("Controller ERROR: Could not create a new match!");
                    return res
                        .status(400)
                        .json({ message: "Controller ERROR: Could not create a new match!" });
                } else {
                    console.log(`Created new complete match between ${currentUser} and ${pendingMatchUser} successfully!
                        (Difficulty: ${difficulty}, Collab Room: ${pendingMatchCollabRoomSocketId})`);
                    return res.status(201).json({
                        message: `Created new complete match between ${currentUser} and ${pendingMatchUser} successfully!
                            (Difficulty: ${difficulty}, Collab Room: ${pendingMatchCollabRoomSocketId})`,
                        user1: currentUser,
                        user2: pendingMatchUser,
                        isPendingMatch: false,
                        user1SocketId: currentUserSocketId,
                        user2SocketId: pendingMatchUserSocketId,
                        collabRoomSocketId: pendingMatchCollabRoomSocketId,
                    });
                }
            } else {
                console.log("pendingMatch does not exist. Making a new pendingMatch.")
                const isPendingMatch = "true";
                const user2 = "";
                const user2SocketId = "";
                const collabRoomSocketId = "Room" + roomCounter;
                roomCounter++;
                const resp = await _createMatch(isPendingMatch, difficulty, currentUser, user2,
                    currentUserSocketId, user2SocketId, collabRoomSocketId);
                console.log(resp);
                if (resp.err) {
                    console.log("Controller ERROR: Could not create a new match!");
                    return res
                        .status(400)
                        .json({ message: "Controller ERROR: Could not create a new match!" });
                } else {
                    console.log(`Created new pendingMatch for ${currentUser} successfully! Difficulty: ${difficulty}`);
                    return res.status(201).json({
                        message: `Created new pendingMatch for ${currentUser} successfully! Difficulty: ${difficulty}`,
                        isPendingMatch: true,
                        collabRoomSocketId: collabRoomSocketId,
                    });
                }
            }
        } else {
            console.log("Controller ERROR: Please provide at least difficulty, currentUser, and currentUserSocketId!");
            return res
                .status(400)
                .json({ message: "Controller ERROR: Please provide at least difficulty, currentUser, and currentUserSocketId!" });
        }
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Controller ERROR: Database failure when creating new match!" });
    }
}

export async function deleteMatch(req, res) {
    try {
        const currentUser = req.params.userID;

        if (currentUser) {
            const matchExistUser1 = await _checkMatchUser1(currentUser);
            console.log(matchExistUser1);
            const matchExistUser2 = await _checkMatchUser2(currentUser);
            console.log(matchExistUser2);
            if (!matchExistUser1 && !matchExistUser2) {
                console.log(`Controller ERROR: currentUser (${currentUser}) is not in any match and cannot be deleted.`)
                return res.status(409).json({
                    message:
                        `Controller ERROR: currentUser (${currentUser}) is not in any match and cannot be deleted.`,
                });
            }

            var deleteMatchUser;
            var deleteMatchId;
            var collabRoomSocketId;
            if (matchExistUser1) {
                // Get user1 in pendingMatch
                deleteMatchUser = matchExistUser1.user1;
                deleteMatchId = matchExistUser1._id;
                collabRoomSocketId = matchExistUser1.collabRoomSocketId;
            } else {
                deleteMatchUser = matchExistUser2.user2;
                deleteMatchId = matchExistUser2._id;
                collabRoomSocketId = matchExistUser2.collabRoomSocketId;
            }

            // Remove pendingMatch from database
            console.log("Deleting match from database.")
            const matchDeleted = await _deleteMatch(deleteMatchId);
            if (matchDeleted.err) {
                console.log("Controller ERROR: Could not delete match!");
                return res
                    .status(400)
                    .json({ message: "Controller ERROR: Could not delete match!" });
            } else {
                console.log(`Deleted match for ${deleteMatchUser} successfully!`);
                return res.status(200).json({
                    message: `Deleted match for ${deleteMatchUser} successfully!`,
                    collabRoomSocketId: collabRoomSocketId,
                });
            }
        } else {
            console.log("Controller ERROR: Please provide at least currentUser!");
            return res
                .status(400)
                .json({ message: "Controller ERROR: Please provide at least currentUser!" });
        }
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ message: "Controller ERROR: Database failure when deleting match!" });
    }
}
