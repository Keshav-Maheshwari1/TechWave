import express from "express";
import {
  getAll,
  getByEmail,
  create,
  updatePhed,
  deletePhed,
} from "../controllers/phedController.js"; // Assuming your phed controller is correctly imported
import { allowRoles } from "../middleware/roleMiddleware.js"; // Importing the allowRoles middleware
import { mockUserMiddleware } from "../middleware/roleMiddleware.js"; // Importing the mockUserMiddleware

const router = express.Router();

// Route to get all pheds (accessible only by 'phed' role)
router.get("/phed", mockUserMiddleware, allowRoles("phed"), getAll);

// Route to get phed by email (accessible only by 'phed' role)
router.get("/phed/:email", mockUserMiddleware, allowRoles("phed"), getByEmail);

// Route to create a new phed (accessible only by 'phed' role)
router.post("/phed", mockUserMiddleware, allowRoles("phed"), create);

// Route to update an existing phed (accessible only by 'phed' role)
router.put("/phed/:email", mockUserMiddleware, allowRoles("phed"), updatePhed);

// Route to delete a phed by email (accessible only by 'phed' role)
router.delete(
  "/phed/:email",
  mockUserMiddleware,
  allowRoles("phed"),
  deletePhed
);

export default router;
