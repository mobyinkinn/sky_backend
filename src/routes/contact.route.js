import { Router } from "express";
import { createContact, deleteContactdetail, getAllcotacts } from "../controllers/contact.controllers.js";

const router = Router();

router.route("/form").post(createContact);
router.route("/get-all-details").get(getAllcotacts);
router.route("/delete/:id").delete(deleteContactdetail);

export default router;
