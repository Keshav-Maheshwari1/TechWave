import mongoose, { Schema } from "mongoose";

const consumerSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: {
    type: String,
   
    unique: true, // Ensure unique emails
    validate: {
      validator: function (v) {
        // Basic email validation
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  date: { type: Date, required: true }, // Help date
  helpDescription: { type: String, required: true }, // Type of help
  panchayat: {
    type: String, // Store the email of the user
    required: true,
    validate: {
      validator: function (value) {
        // Simple email regex validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email format.",
    },
  }, // Reference to Panchayat
});

const Consumer = mongoose.model("Consumer", consumerSchema);
export default Consumer;
