// route.js
import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();
import {
  getDuties,
  createDuty,
  getDutyById,
  updateDuty,
  deleteDuty,
} from "../controllers/duty.controller";

router.post(
  "/",
  body("name").notEmpty().withMessage("Name is required"),
  createDuty
);
router.get("/", getDuties);
router.get("/:id", getDutyById);
router.put(
  "/:id",
  body("name").notEmpty().withMessage("Name is required"),
  updateDuty
);
router.delete("/:id", deleteDuty);

export default router;
