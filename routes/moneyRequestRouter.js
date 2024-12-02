import express from "express";
import {
  createMoneyRequest,
  getMoneyRequests,
  updateMoneyRequest,
  deleteMoneyRequest,
} from "../controllers/moneyRequestController.js"; // Importing the controller functions
import { mockUserMiddleware, allowRoles } from "../middleware/roleMiddleware.js"; // Importing middlewares

const router = express.Router();

// Route to create a MoneyRequest (only accessible by GP)
router.post(
  "/money-request",
  mockUserMiddleware,
  allowRoles("gp"),
  createMoneyRequest
);

// Route to get MoneyRequests (only accessible by GP for their own requests)
router.get(
  "/money-requests",
  mockUserMiddleware,
  allowRoles("gp"),
  getMoneyRequests
);

// Route to update MoneyRequest (only accessible by Phed)
router.put(
  "/money-request",
  mockUserMiddleware,
  allowRoles("phed"),
  updateMoneyRequest
);

// Route to delete a MoneyRequest (only accessible by Phed)
router.delete(
  "/money-request/:email", // Assuming you want to delete by panchayat email
  mockUserMiddleware,
  allowRoles("phed"),
  deleteMoneyRequest
);

export default router;
