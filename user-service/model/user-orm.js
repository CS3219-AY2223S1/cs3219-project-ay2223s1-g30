import { checkUser, createUser, deleteUser, updateUser } from "./repository.js";

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

export async function ormDeleteUser(username) {
	try {
		const deletedUser = await deleteUser({ username: username });
		return deletedUser;
	} catch (err) {
		console.log("ERROR: Could not delete user");
		return { err };
	}
}

export async function ormUpdateUser(id, password) {
	try {
		const updatedUser = await updateUser(id, { password: password });
		return updatedUser;
	} catch (err) {
		console.log("ERROR: Could not update user");
		return { err };
	}
}
