import mongoose from "mongoose";
import { isURL } from "validator";

function urlSchema(opts = {}) {
	const { required } = opts;
	return {
		type: String,
		required: !!required,
		validate: {
			validator: isURL,
			message: (props) => `${props.value} is not a valid URL`,
		},
	};
}

const replySchema = new mongoose.Schema(
	{
		refQues_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "ques",
			required: true,
		},
		replies: [
			{
				votes: {
					type: Number,
					default: 0,
				},
				replyCont: { type: String, required: true },

				createdBy: {
					type: String,
					required: true,
				},
				userRef_id: {
					type: mongoose.SchemaTypes.ObjectId,
					ref: "user",
					required: true,
				},
				imgurl: urlSchema(),
				createdOn: { type: Date, default: Date.now() },
			},
		],
	},

	{ timestamps: true }
);

// replySchema.index({ (replies.createdBy: 1), refQues_id:1  }, { unique: true });

export const Reply = mongoose.model("reply", replySchema);
