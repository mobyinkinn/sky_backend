import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createCareersData, deletecareersbyId, getCareersData, updateCareersById } from "../controllers/careers.controllers.js";

const router = Router();

router.route("/create-careers").post(createCareersData);
router.route("/get-careers").get(getCareersData);
router.route("/deleteById").delete(deletecareersbyId);
router.route("/updateById").put(updateCareersById);



export default router;