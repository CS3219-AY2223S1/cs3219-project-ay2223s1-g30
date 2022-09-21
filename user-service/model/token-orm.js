import { createToken, checkToken } from "./repository.js"

export async function ormCreateToken(token, date)  {
    try {
        const newToken = await createToken({ token, date });
        newToken.save();
        return true;
    } catch (err) {
        console.log("ERROR: Could not create new token");
        return { err };
    }
}

export async function ormCheckToken(token) {
    try {
        const tokenExist = await checkToken({ token: token });
        return tokenExist;
    } catch (err) {
        console.log("ERROR: Could not check for token");
		return { err };
    }
}