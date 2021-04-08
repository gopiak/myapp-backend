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

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		google_id: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		img_url: urlSchema(),
		skills: { type: [String] },
		loggedIn: { type: Boolean, required: true, default: true },
	},
	{ timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("user", userSchema);
