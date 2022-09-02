import { checkUser, createUser } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
	try {
		const newUser = await createUser({ username, password });
		newUser.save();
		return true;
	} catch (err) {
		console.log("ERROR: Could not create new user");
		return { err };
	}
}

export async function ormCheckUser(username) {
	try {
		const userExist = await checkUser({ username: username });
		return userExist;
	} catch (err) {
		console.log("ERROR: Could not check for user");
		return { err };
	}
}
