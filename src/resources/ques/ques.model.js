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

const queSchema = new mongoose.Schema(
	{
		quesheader: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		status: {
			type: String,
			required: true,
			enum: ["answered", "notAnswered", "archived"],
			default: "notAnswered",
		},
		description: { type: String },
		tags: { type: [String], index: true },
		userRef_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "user",
			required: true,
		},
		createdBy: {
			type: String,
			required: true,
		},
		imgurl: urlSchema(),
	},
	{ timestamps: true }
);

// queSchema.index({ list: 1, name: 1 }, { unique: true });

export const Ques = mongoose.model("ques", queSchema);
