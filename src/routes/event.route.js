import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createEvent,
  getAllEvents,
  updateEvents,
  deleteEvents,
  blockEvents,
  UnblockEvents,
  updateImage,
  getEventById,
} from "../controllers/event.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(
  upload.fields([
    { name: "images", maxCount: 6 },
    { name: "image", maxCount: 1 },
  ]),
  createEvent
);
router.route("/get-by-slug").get(getEventById);
router.route("/get-all").get(getAllEvents);
router.route("/block-event/:id").put(blockEvents);
router.route("/unblock-event/:id").put(UnblockEvents);
router.route("/update/:id").post(updateEvents);
router
  .route("/update-image/:id")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), updateImage);
router.route("/delete/:id").get(deleteEvents);

export default router;
