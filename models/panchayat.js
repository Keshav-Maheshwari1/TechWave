import mongoose, { Schema } from "mongoose";

const panchayatSchema = new Schema({
  name: { type: String, required: true },
  images: {
    type: [{ type: String }], // Array of strings
    required: true, // Array is required
    validate: {
      validator: function (value) {
        return value && value.length > 0; // Ensure at least one element
      },
      message: "At least one image is required.",
    },
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  address: { type: String, required: true },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid contact number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique emails
    validate: {
      validator: function (v) {
        // Basic email validation
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
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
  serviceDescription: { type: String, required: true },
});

const Panchayat = mongoose.model("Panchayat", panchayatSchema);
export default Panchayat;
