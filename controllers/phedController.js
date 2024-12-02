import Phed from "../models/phed.js";
import Panchayat from "../models/panchayat.js"; // Assuming Panchayat model is correctly imported
import MoneyRequest from "../models/moneyRequest.js"; // Assuming MoneyRequest model is correctly imported
import mongoose from "mongoose";

export const getAll = async (req, res) => {
  try {
    if (req.user.role !== "phed") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }
    const pheds = await Phed.find();
    res.status(200).json(pheds);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    if (req.user.role !== "phed") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }
    const phed = await Phed.findOne({ email: email });
    if (!phed) {
      return res.status(404).json({ message: "Phed not found" });
    }
    res.status(200).json(phed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Create a new Phed
export const create = async (req, res) => {
  const { name, address, contactNumber, email, registeredDate } = req.body;

  try {
    if (req.user.role !== "phed") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }

    const existingPhed = await Phed.findOne({ email });
    if (existingPhed) {
      return res
        .status(400)
        .json({ message: "Phed with this email already exists" });
    }

    const newPhed = new Phed({
      name,
      address,
      contactNumber,
      email,
      registeredDate,
    });

    await newPhed.save();
    res.status(201).json({ message: "Phed created successfully", newPhed });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updatePhed = async (req, res) => {
  const emailId = req.params.email;
  const { name, address, contactNumber, email, registeredDate } = req.body;

  // Start a session for transaction handling
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (req.user.role !== "phed") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }

    // Find the Phed document to be updated
    const phed = await Phed.findOne({ email: emailId }).session(session);
    if (!phed) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Phed not found" });
    }

    // Check if the email is being updated
    const emailChanged = email && email !== phed.email;

    // Update the Phed document
    phed.name = name || phed.name;
    phed.address = address || phed.address;
    phed.contactNumber = contactNumber || phed.contactNumber;
    phed.email = email || phed.email;
    phed.registeredDate = registeredDate || phed.registeredDate;

    // Save the updated Phed document
    await phed.save({ session });

    // If email is updated, update email in Panchayat and MoneyRequest
    if (emailChanged) {
      // Update email in all related Panchayat documents
      await Panchayat.updateMany(
        { email: phed.email },
        { $set: { email: email } }
      ).session(session);

      // Update email in all related MoneyRequest documents
      await MoneyRequest.updateMany(
        { email: phed.email },
        { $set: { email: email } }
      ).session(session);
    }

    // Commit the transaction if all operations were successful
    await session.commitTransaction();

    // Send success response
    res.status(200).json({ message: "Phed updated successfully", phed });
  } catch (err) {
    // Abort the transaction if any operation fails
    await session.abortTransaction();
    console.error("Error updating Phed:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    // End the session after the transaction
    session.endSession();
  }
};

export const deletePhed = async (req, res) => {
  const email = req.params.email;

  // Start a session for transaction handling
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (req.user.role !== "phed") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }

    // Find the Phed document to be deleted
    const phed = await Phed.findOne({ email: email }).session(session);
    if (!phed) {
      await session.abortTransaction(); // Abort if Phed is not found
      return res.status(404).json({ message: "Phed not found" });
    }

    // Unset email in related Panchayat documents
    await Panchayat.updateMany(
      { email: phed.email },
      { $unset: { email: 1 } }
    ).session(session);

    // Unset email in related MoneyRequest documents
    await MoneyRequest.updateMany(
      { email: phed.email },
      { $unset: { email: 1 } }
    ).session(session);

    // Delete the Phed document
    await Phed.findOneAndDelete({ email: phed.email }).session(session);

    // Commit the transaction if everything was successful
    await session.commitTransaction();

    // Send a success response
    res.status(200).json({ message: "Phed deleted successfully" });
  } catch (err) {
    // Abort the transaction if any errors occur
    await session.abortTransaction();
    console.error("Error deleting Phed:", err);
    return res.status(500).json({ error: err.message });
  } finally {
    // End the session after the transaction
    session.endSession();
  }
};
