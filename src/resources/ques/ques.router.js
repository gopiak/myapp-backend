import { Router } from "express";
import controllers from "./ques.controllers";

const router = Router();

// /api/ques
router.route("/").get(controllers.getManyQues).post(controllers.createOneQues);

// /api/ques/:id
router
	.route("/:id")
	.get(controllers.getOneQues)
	.put(controllers.updateOneQues)
	.delete(controllers.removeOneQues);

export default router;
