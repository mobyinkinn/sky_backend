import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { blockCareer, createCareersData, deletecareersbyId, getCareersData, UnblockCareer, updateCareersById } from "../controllers/careers.controllers.js";

const router = Router();

router.route("/create-careers").post(createCareersData);
router.route("/get-careers").get(getCareersData);
router.route("/deleteById").delete(deletecareersbyId);
router.route("/updateById").put(updateCareersById);
router.route("/block-career/:id").put(blockCareer);
router.route("/unblock-career/:id").put(UnblockCareer);


export default router;