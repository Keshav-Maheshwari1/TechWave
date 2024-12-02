import mongoose, { Schema } from "mongoose";

// Define the schema for MoneyRequest
const moneyRequestSchema = new Schema({
  panchayat: {
    type: String, // Store the email of the panchayat
    required: true,
    validate: {
      validator: function (value) {
        // Simple email regex validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email format.",
    },
  },
  phed: {
    type: String, // Store the email of the phed
    required: true,
    validate: {
      validator: function (value) {
        // Simple email regex validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email format.",
    },
  },
  amountRequested: {
    type: Number, // Amount of money requested
    required: true,
  },
  reason: {
    type: String, // Reason for the money request
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"], // Status of the request
    default: "Pending", // Default status
  },
  requestDate: {
    type: Date,
    default: Date.now, // Date when the request was made
  },
  approvedAmount: {
    type: Number, // Amount that was approved (if any)
  },
  approvedDate: {
    type: Date, // Date when the money request was approved (if approved)
  },
});

const MoneyRequest = mongoose.model("MoneyRequest", moneyRequestSchema);
export default MoneyRequest;
