import express from "express";
import {
  createConsumer,
  getAllConsumers,
  getConsumerByEmail,
  updateConsumer,
  deleteConsumer,
} from "../controllers/consumerController.js"; // Assuming your consumer controller is correctly imported
import { allowRoles } from "../middleware/roleMiddleware.js"; // Importing the allowRoles middleware
import { mockUserMiddleware } from "../middleware/roleMiddleware.js.js"; // Importing the mockUserMiddleware

const router = express.Router();

// Route to create a new Consumer (accessible only by 'gp' role)
router.post(
  "/consumer",
  mockUserMiddleware,
  allowRoles("gp"),
  createConsumer
);

// Route to get all Consumers by Panchayat email (accessible only by 'gp' role)
router.get(
  "/consumer/:panchayatEmail",
  mockUserMiddleware,
  allowRoles("gp"),
  getAllConsumers
);

// Route to get a Consumer by email (accessible only by 'gp' role)
router.get(
  "/consumer/:email",
  mockUserMiddleware,
  allowRoles("gp"),
  getConsumerByEmail
);

// Route to update a Consumer by email (accessible only by 'gp' role)
router.put(
  "/consumer/:email",
  mockUserMiddleware,
  allowRoles("gp"),
  updateConsumer
);

// Route to delete a Consumer by email (accessible only by 'gp' role)
router.delete(
  "/consumer/:email",
  mockUserMiddleware,
  allowRoles("gp"),
  deleteConsumer
);

export default router;
