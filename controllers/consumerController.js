import Consumer from "../models/consumer.js";

// Create a new Consumer
export const createConsumer = async (req, res) => {
  const {
    name,
    address,
    contactNumber,
    email,
    date,
    helpDescription,
    panchayat,
  } = req.body;

  try {
    // Ensure that only users with the 'gp' role can create a consumer
    if (req.user.role !== "gp") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }

    const existingConsumer = await Consumer.findOne({ email });
    if (existingConsumer) {
      return res
        .status(400)
        .json({ message: "Consumer with this email already exists!" });
    }

    const newConsumer = new Consumer({
      name,
      address,
      contactNumber,
      email,
      date,
      helpDescription,
      panchayat,
    });
    await newConsumer.save();
    res.status(201).json({
      message: "Consumer created successfully",
      consumer: newConsumer,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get all Consumers by Gram Panchayat email
export const getAllConsumers = async (req, res) => {
  const { panchayatEmail } = req.params; // Get Gram Panchayat email from the request params

  try {
    // Ensure that only users with the 'gp' role can access this endpoint
    if (req.user.role !== "gp") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }

    // Find all consumers where the panchayat email matches the provided email
    const consumers = await Consumer.find({ panchayat: panchayatEmail });

    if (consumers.length === 0) {
      return res
        .status(404)
        .json({ message: "No consumers found for this Panchayat email" });
    }

    res.status(200).json(consumers);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get a Consumer by email
export const getConsumerByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Ensure that only users with the 'gp' role can access this endpoint
    if (req.user.role !== "gp") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }

    const consumer = await Consumer.findOne({ email });
    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }
    res.status(200).json(consumer);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update a Consumer by email
export const updateConsumer = async (req, res) => {
  const { email } = req.params;
  const { name, address, contactNumber, date, helpDescription, panchayat } =
    req.body;

  try {
    // Ensure that only users with the 'gp' role can update a consumer
    if (req.user.role !== "gp") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }

    const consumer = await Consumer.findOne({ email });
    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    // Update the consumer details
    consumer.name = name || consumer.name;
    consumer.address = address || consumer.address;
    consumer.contactNumber = contactNumber || consumer.contactNumber;
    consumer.date = date || consumer.date;
    consumer.helpDescription = helpDescription || consumer.helpDescription;
    consumer.panchayat = panchayat || consumer.panchayat;

    await consumer.save();
    res
      .status(200)
      .json({ message: "Consumer updated successfully", consumer });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a Consumer by email
export const deleteConsumer = async (req, res) => {
  const { email } = req.params;

  try {
    // Ensure that only users with the 'gp' role can delete a consumer
    if (req.user.role !== "gp") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access to the endpoint" });
    }

    const consumer = await Consumer.findOne({ email });
    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    // Delete the consumer document
    await Consumer.findOneAndDelete({ email: email });;
    res.status(200).json({ message: "Consumer deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
