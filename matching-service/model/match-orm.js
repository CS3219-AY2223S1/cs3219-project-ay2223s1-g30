import { checkMatch, createMatch } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateMatch(matchId, user1, user2) {
    try {
        const newMatch = await createMatch({ matchId, user1, user2 });
        newMatch.save();
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new match");
        return { err };
    }
}

export async function ormCheckMatch(id) {
    try {
        const matchExist = await checkMatch({ matchId: id });
        return matchExist;
    } catch (err) {
        console.log("ERROR: Could not check for match");
        return { err };
    }
}