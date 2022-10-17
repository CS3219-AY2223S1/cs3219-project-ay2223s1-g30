import { checkMatch, createMatch, deleteMatch } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateMatch(
	isPendingMatch,
	difficulty,
	user1,
	user2,
	user1SocketId,
	user2SocketId,
	collabRoomSocketId
) {
	try {
		const newMatch = await createMatch({
			isPendingMatch,
			difficulty,
			user1,
			user2,
			user1SocketId,
			user2SocketId,
			collabRoomSocketId,
		});
		newMatch.save();
		return true;
	} catch (err) {
		console.log("ORM ERROR: Could not create new match");
		return { err };
	}
}

export async function ormCheckMatchUser1(user) {
	try {
		const matchExist = await checkMatch({ user1: user });
		console.log(`ORM: Checking for user1: ${user}`);
		return matchExist;
	} catch (err) {
		console.log("ORM ERROR: Could not check for match");
		return { err };
	}
}

export async function ormCheckMatchUser2(user) {
	try {
		const matchExist = await checkMatch({ user2: user });
		console.log(`ORM: Checking for user2: ${user}`);
		return matchExist;
	} catch (err) {
		console.log("ORM ERROR: Could not check for match");
		return { err };
	}
}

export async function ormFindPendingMatch(difficulty) {
	try {
		const matchExist = await checkMatch({
			isPendingMatch: true,
			difficulty: difficulty,
		});
		console.log(`ORM: Finding pending match.`);
		return matchExist;
	} catch (err) {
		console.log("ORM ERROR: Could not find for pending match");
		return { err };
	}
}

export async function ormDeleteMatch(id) {
	try {
		const newMatch = await deleteMatch({ _id: id });
		//newMatch.save();
		return true;
	} catch (err) {
		console.log("ORM ERROR: Could not delete match");
		return { err };
	}
}
