import { User } from "../user/user.model";

export const list = async (req, res) => {
	try {
		const users = await User.find({}).lean().exec();

		res.status(200).json({ data: users });
	} catch (e) {
		console.error(e);
		res.status(400).end();
	}
};
