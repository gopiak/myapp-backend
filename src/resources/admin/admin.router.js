import { Router } from "express";
import { list } from "./admin.controllers";

const router = Router();

router.get("/listUsers", list);

export default router;
