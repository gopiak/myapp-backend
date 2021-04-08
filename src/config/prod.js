require("dotenv").config();
export const adminPassword = process.env.ADMIN_PASSWORD || "iamTheAdmin";
export const jwtSecret = process.env.JWT_SECRET || "mark it zero";
export const mongo = {
	connectionString: process.env.MONGO_URI || "mongodb://localhost:27017/api",
};
