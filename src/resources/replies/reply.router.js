import { Router } from "express";
import controllers from "./reply.controllers";

const router = Router();

// /api/reply/:id
router
	.route("/:id")
	.post(controllers.createOneReply)
	.put(controllers.updateReply)
	.delete(controllers.removeReply);

export default router;
