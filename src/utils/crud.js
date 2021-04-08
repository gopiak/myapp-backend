import { Ques } from "../resources/ques/ques.model";

// Ques Controllers
export const getOneQues = (model) => async (req, res) => {
	try {
		const quesDoc = await model
			.findOne({
				_id: req.params.id,
			})
			.lean()
			.exec();
		if (!quesDoc) {
			console.log("Can't fetch the Ques");
			return res.status(400).end();
		}
		res.status(200).json({ data: quesDoc });
	} catch (error) {
		console.error(error);
		res.status(400).end();
	}
};

async function list(opts = {}, model) {
	const { offset = 0, limit = 25, tag } = opts;

	const query = tag ? { tags: tag } : {};
	const result = await model
		.find(query)
		.sort({ _id: 1 })
		.skip(offset)
		.limit(limit)
		.lean()
		.exec();

	return result;
}

export const getManyQues = (model) => async (req, res) => {
	const { offset = 0, limit = 25, tag } = req.query;
	try {
		const quesDocs = await list(
			{
				offset: Number(offset),
				limit: Number(limit),
				tag,
			},
			model
		);

		if (!quesDocs) {
			return res.status(400).end();
		}
		res.status(200).json({ data: quesDocs });
	} catch (error) {
		console.error(error);
		res.status(400).end();
	}
};

export const createOneQues = (model) => async (req, res) => {
	try {
		const quesDoc = await model.create({
			userRef_id: req.user._id,
			createdBy: req.user.name,
			...req.body,
		});

		if (!quesDoc) {
			return res.status(400).end();
		}
		res.status(201).json({ data: quesDoc });
	} catch (error) {
		console.error(error);
		res.status(400).end();
	}
};

export const updateOneQues = (model) => async (req, res) => {
	try {
		const quesDoc = await model
			.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
			.lean()
			.exec();
		if (!quesDoc) {
			return res.status(400).end();
		}
		res.status(201).json({ data: quesDoc });
	} catch (error) {
		console.error(error);
		res.status(400).end();
	}
};

export const removeOneQues = (model) => async (req, res) => {
	try {
		console.log("Trying to remove one ques ");
		const removed = await model.findOneAndRemove({
			userRef_id: req.user._id,
			_id: req.params.id,
		});
		if (!removed) {
			return res.status(400).end();
		}

		return res.status(200).json({ data: removed });
	} catch (error) {
		console.error(error);
		res.status(400).end();
	}
};

// Replies handlers

export const createOneReply = (model) => async (req, res) => {
	try {
		console.log("Trying to create reply model");

		let replyDoc = await model
			.findOneAndUpdate(
				{ refQues_id: req.params.id },
				{
					$push: {
						replies: {
							...req.body,
							createdBy: req.user.name,
							userRef_id: req.user._id,
						},
					},
				},
				{ new: true }
			)
			.lean()
			.exec();

		if (!replyDoc) {
			console.log("Creating new reply doc");
			replyDoc = await model.create({
				refQues_id: req.params.id,
				replies: [
					{
						...req.body,
						userRef_id: req.user._id,
						createdBy: req.user.name,
					},
				],
			});
			const quesDoc = await Ques.findOneAndUpdate(
				{ _id: req.params.id },
				{ status: "answered" },
				{ new: true }
			)
				.lean()
				.exec();
			if (!quesDoc) {
				return res.status(400).end();
			}
			if (!replyDoc) {
				console.log("Can't create Reply collection");
				return res.status(400).end();
			}
		}
		res.status(201).json({ data: replyDoc });
	} catch (error) {
		console.error(error);
		res.status(400).end();
	}
};

export const updateReply = (model) => async (req, res) => {
	const userId = req.user.id;
	console.log(req.body.replyCont);
	try {
		const replyDoc = await model
			.findOneAndUpdate(
				{
					refQues_id: req.params.id,
				},
				{
					$set: { "replies.$[reply].replyCont": `${req.body.replyCont}` },
				},
				{
					arrayFilters: [{ "reply.userRef_id": { $eq: req.user._id } }],
					new: true,
				}
			)
			.lean()
			.exec();
		console.log("Reply Doc : " + JSON.stringify(replyDoc));
		if (!replyDoc) {
			console.log("Can't update :(");
			console.log(replyDoc);
			return res.status(400).end();
		}
		res.status(201).json({ data: replyDoc });
	} catch (error) {
		console.error(error);
		res.status(400).end();
	}
};

export const removeReply = (model) => async (req, res) => {
	try {
		const removed = await model
			.findOneAndUpdate(
				{
					refQues_id: req.params.id,
				},
				{
					$pull: { replies: { userRef_id: req.user._id } },
				},

				{ new: true }
			)
			.lean()
			.exec();
		if (!removed) {
			console.log("can't remove");
			return res.status(400).end();
		}

		return res.status(200).json({ data: removed });
	} catch (error) {
		console.error(error);
		res.status(400).end();
	}
};

export const crudControllersReply = (model) => ({
	createOneReply: createOneReply(model),
	updateReply: updateReply(model),
	removeReply: removeReply(model),
});

export const crudControllersQues = (model) => ({
	getOneQues: getOneQues(model),
	getManyQues: getManyQues(model),
	createOneQues: createOneQues(model),
	updateOneQues: updateOneQues(model),
	removeOneQues: removeOneQues(model),
});
