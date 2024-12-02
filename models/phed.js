import mongoose, { Schema } from "mongoose";

const phedSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Example: Validate if contactNumber is a 10-digit number
        return /^\d{10}$/.test(v);
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
  registeredDate: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for better search performance (optional)
phedSchema.index({ email: 1 });
phedSchema.index({ contactNumber: 1 });

const Phed = mongoose.model("PHED", phedSchema);
export default Phed;
