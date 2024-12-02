import mongoose from "mongoose";
import Panchayat from "../models/Panchayat.js";
import MoneyRequest from "../models/MoneyRequest.js";
import Consumer from "../models/Consumer.js";
import { getImagesAsStringArray } from "../utils/imageUtils.js"; // Utility for handling image URLs

// Get Panchayat by email
export const getPanchayatByEmail = async (req, res) => {
  const { email } = req.params;

  // Role-based access control for GET
  if (req.user.role !== "gp" && req.user.role !== "phed") {
    return res.status(403).json({
      message: "Unauthorized access. Only GP and Phed can access this.",
    });
  }

  try {
    const panchayat = await Panchayat.findOne({ email });
    if (!panchayat) {
      return res.status(404).json({ message: "Panchayat not found" });
    }
    res.status(200).json(panchayat);
  } catch (error) {
    console.error("Error fetching Panchayat:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create Panchayat
export const createPanchayat = async (req, res) => {
  const {
    name,
    images,
    location,
    address,
    contactNumber,
    email,
    phed,
    serviceDescription,
  } = req.body;

  if (req.user.role !== "gp") {
    return res
      .status(403)
      .json({ message: "Unauthorized access. Only GP can create Panchayat." });
  }

  try {
    const imageUrls = await getImagesAsStringArray(images);

    const panchayat = new Panchayat({
      name,
      images: imageUrls,
      location,
      address,
      contactNumber,
      email,
      phed,
      serviceDescription,
    });

    await panchayat.save();
    res
      .status(201)
      .json({ message: "Panchayat created successfully", panchayat });
  } catch (error) {
    console.error("Error creating Panchayat:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Panchayat
export const updatePanchayat = async (req, res) => {
  const { emailId } = req.params.email;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      images,
      location,
      address,
      contactNumber,
      serviceDescription,
      email: newEmail,
    } = req.body;

    // Check for GP role
    if (req.user.role !== "gp") {
      throw new Error("Unauthorized access. Only GP can update Panchayat.");
    }

    // Find the Panchayat using the session email
    const panchayat = await Panchayat.findOne({
      email: emailId,
    }).session(session);
    if (!panchayat) {
      throw new Error("Panchayat not found");
    }

    // Update fields
    if (name) panchayat.name = name;
    if (location) panchayat.location = location;
    if (address) panchayat.address = address;
    if (contactNumber) panchayat.contactNumber = contactNumber;
    if (serviceDescription) panchayat.serviceDescription = serviceDescription;

    // Update images if provided
    if (images && images.length > 0) {
      panchayat.images = await getImagesAsStringArray(images);
    }

    // If email changes, propagate the update across related collections
    if (newEmail && newEmail !== req.user.email) {
      await MoneyRequest.updateMany(
        { panchayat: emailId },
        { panchayat: newEmail }
      ).session(session);
      await Consumer.updateMany(
        { gpEmail: req.user.email },
        { gpEmail: newEmail }
      ).session(session);
      panchayat.email = newEmail;
    }

    await panchayat.save({ session });
    await session.commitTransaction();
    res
      .status(200)
      .json({ message: "Panchayat updated successfully", panchayat });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error updating Panchayat:", error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Delete Panchayat
export const deletePanchayat = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check for GP role
    if (req.user.role !== "gp") {
      throw new Error("Unauthorized access. Only GP can delete Panchayat.");
    }

    // Find the Panchayat by session email
    const panchayat = await Panchayat.findOne({
      email: req.user.email,
    }).session(session);
    if (!panchayat) {
      throw new Error("Panchayat not found");
    }

    // Delete related entries
    await MoneyRequest.deleteMany({ gpEmail: req.user.email }).session(session);
    await Consumer.deleteMany({ gpEmail: req.user.email }).session(session);

    // Delete Panchayat
    await Panchayat.deleteOne({ email: req.user.email }).session(session);

    await session.commitTransaction();
    res
      .status(200)
      .json({ message: "Panchayat and related records deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error deleting Panchayat:", error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
